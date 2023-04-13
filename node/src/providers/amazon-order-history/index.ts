import { stringify } from 'querystring'
import { gunzipSync } from 'zlib'
import { Provider } from '../../types'
import { getCompleteHttpResponseFromTranscript, getHttpRequestHeadersFromTranscript } from '../../utils/http-parser'
import { parseResponse } from './utils'

// params for the request that will be publicly available
type AmazonOrderHistoryParams = {
	/**
	 * the name of the product you're trying
	 * to claim to have purchased
	 * */
	productName: string
}

// params required to generate the http request to Amazon
// these would contain fields that are to be hidden from the public,
// including the witness
type AmazonOrderHistorySecretParams = {
	/** cookie string for authentication */
	cookieStr: string
	/**
	 * query that'll return the product you're trying to claim
	 * Eg. if you've bought "ABCD mouse",
	 * then the query could be "mouse"
	 */
	qstring: string
}

// where to send the HTTP request
const HOST = 'www.amazon.in'
const PORT = 443
const HOSTPORT = `${HOST}:${PORT}`

const PATH = '/gp/your-account/order-history/ref=ppx_yo_dt_b_search'

const amazonOrderHistory: Provider<AmazonOrderHistoryParams, AmazonOrderHistorySecretParams> = {
	hostPorts: [HOSTPORT],
	areValidParams(params): params is AmazonOrderHistoryParams {
		return typeof params.productName === 'string'
			&& Object.keys(params).length === 1
	},
	createRequest({ cookieStr, qstring }) {
		// serialise the HTTP request
		// add the "search" query string
		// we won't redact it because it's not sensitive
		const qr = stringify({ opt: 'ab', search: qstring })
		// this is a simple http request construction.
		// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
		const strRequest = [
			`GET ${PATH}?${qr} HTTP/1.1`,
			'Host: ' + HOST,
			// "connection: close" ensures the server terminates
			// the connection after the first HTTP request is done.
			// We add this header to prevent the user from creating
			// multiple http requests in the same session
			'Connection: close',
			'Content-Length: 0',
			'User-Agent: reclaim/1.0.0',
			`Cookie: ${cookieStr}`,
			'Accept-Encoding: gzip, deflate, br',
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
	assertValidProviderReceipt(receipt, { productName }) {
		productName = productName.toLowerCase()
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

		// parse the HTML response and check if
		// the product name is in the list of orders
		const orders = parseResponse(html)
		if(!orders.find(order => (
			// check if the order's name starts with the product name
			// this seems to be a constraint that cannot be
			// falsified but at the same time, is flexible enough
			// to account for funky descriptions in the product
			// and whitespace
			order.name.toLowerCase().startsWith(productName)
		))) {
			throw new Error(`Failed to find "${productName}" in receipt`)
		}
	},
}

export default amazonOrderHistory