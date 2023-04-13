import { gunzipSync } from 'zlib'
import { DEFAULT_PORT, Provider } from '../../types'
import { getCompleteHttpResponseFromTranscript, getHttpRequestHeadersFromTranscript } from '../../utils/http-parser'
import { parseResponse } from './utils'
// import { parseResponse } from './utils'

// params for the request that will be publicly available
// contains the userId of the logged in user
type YCombinatorLoginParams = {
	userId: number
}

// params required to generate the http request to YC
// these would contain fields that are to be hidden from the public,
// including the witness
type YCombinatorLoginSecretParams = {
	/** cookie string for authentication */
	cookieStr: string
}

// where to send the HTTP request
const HOST = 'bookface.ycombinator.com'
const HOSTPORT = `${HOST}:${DEFAULT_PORT}`

const PATH = '/home'

const YCombinatorLogin: Provider<YCombinatorLoginParams, YCombinatorLoginSecretParams> = {
	hostPort: HOSTPORT,
	areValidParams(params): params is YCombinatorLoginParams {
		return (
			typeof params.userId === 'number'
            && params.userId !== 0
		)
	},
	createRequest({ cookieStr }) {
		// this is a simple http request construction.
		// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
		const strRequest = [
			`GET ${PATH} HTTP/1.1`,
			'Host: ' + HOST,
			// "connection: close" ensures the server terminates
			// the connection after the first HTTP request is done.
			// We add this header to prevent the user from creating
			// multiple http requests in the same session
			'Connection: close',
			`cookie: ${cookieStr}`,
			'User-Agent: reclaim/1.0.0',
			'Accept-Encoding: gzip, deflate',
			'\r\n'
		].join('\r\n')

		// find the cookie string and redact it
		const data = Buffer.from(strRequest)
		const cookieStartIndex = data.indexOf(cookieStr)

		return {
			data,
			// anything that should be redacted from the transcript
			// should be added to this array
			redactions: [
				{
					fromIndex: cookieStartIndex,
					toIndex: cookieStartIndex + cookieStr.length
				}
			]
		}
	},
	assertValidProviderReceipt(receipt, { userId }) {
		// ensure the request was sent to the right place
		if(receipt.hostPort !== HOSTPORT) {
			throw new Error(`Invalid hostPort: ${receipt.hostPort}`)
		}

		// parse the HTTP request & check
		// the method, URL, headers, etc. match what we expect
		const req = getHttpRequestHeadersFromTranscript(receipt.transcript)
		if(req.method !== 'get') {
			throw new Error(`Invalid method: ${req.method}`)
		}

		if(!req.url.startsWith(PATH)) {
			throw new Error(`Invalid path: ${req.url}`)
		}

		const res = getCompleteHttpResponseFromTranscript(
			receipt.transcript
		)

		if(!res.headers['content-type']?.startsWith('text/html')) {
			throw new Error(`Invalid content-type: ${res.headers['content-type']}`)
		}

		let html: string
		if(res.headers['content-encoding'] === 'gzip') {
			const buf = Buffer.from(res.body)
			html = gunzipSync(buf).toString()
		} else {
			html = res.body.toString()
		}

		const { hasBookfaceObject, userInfoObject } = parseResponse(html)

		// Check if the account is valid and has access to bookface
		if(!hasBookfaceObject['hasBookface']) {
			throw new Error('Invalid login - does not have bookface access')
		}

		// Check if the logged in user the same as they calimed to be
		if(userInfoObject['currentUser']['id'] !== userId) {
			throw new Error('Invalid login - inconsistent user id')
		}

	},
}

export default YCombinatorLogin
