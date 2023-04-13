import { parse } from 'url'
import { Provider } from '../../types'
import { BufferSlice } from '../../types/sessions'
import { getCompleteHttpResponseFromTranscript, getHttpRequestHeadersFromTranscript } from '../../utils/http-parser'
import { extractHTMLElement, extractJSONElement } from './utils'


export type HTTPProviderParams = {
    /**
     * which URL does the request have to be made to
     * for eg. https://amazon.in/orders?q=abcd
     */
    url: string
    /** HTTP method */
    method: 'GET' | 'POST'
    /** which portions to select from a response. If both are set, then JSON path is taken after xPath is found */
    responseSelection: {
        /**
         * expect an HTML response, and to contain a certain xpath
         * for eg. "/html/body/div.a1/div.a2/span.a5"
         */
        xPath: string
        /**
         * expect a JSON response, retrieve the item at this path
         * using dot notation
         * for e.g. 'email.addresses.0'
         */
        jsonPath: string
    }
    /** A regexp to match the "responseSelection" to */
    responseMatch: RegExp | string
}

export type HTTPProviderSecretParams = {
	/**
	 * which URL does the request have to be made to
	 * for eg. https://amazon.in/orders?q=abcd
	 */
	url: string
	/** HTTP method */
	method: 'GET' | 'POST'
    /** cookie string for authorisation. Will be redacted from witness */
    cookieStr?: string
    /** authorisation header value. Will be redacted from witness */
    authorisationHeader?: string
}

const REVEAL_BUFFER = 10

const httpProvider: Provider<HTTPProviderParams, HTTPProviderSecretParams> = {
	hostPorts: [],
	areValidParams(params): params is HTTPProviderParams {
		return (params.responseMatch instanceof RegExp) &&
            typeof params.url === 'string' &&
            (params.method === 'GET' || params.method === 'POST') &&
            (params.responseSelection !== undefined)
	},
	createRequest(secretParams) {
		const { host, path } = parse(secretParams.url)
		if(!host || !path) {
			throw new Error('url is incorrect')
		}

		if(!secretParams.cookieStr && !secretParams.authorisationHeader) {
			throw new Error('auth parameters are not set')
		}

		const authStr: string[] = []
		if(secretParams.cookieStr) {
			authStr.push(`cookie: ${secretParams.cookieStr}`)
		}

		if(secretParams.authorisationHeader) {
			authStr.push(`authorization: ${secretParams.authorisationHeader}`)
		}

		let authLen = authStr.reduce((sum, current) => sum + current.length, 0)
		if(authStr.length > 1) {
			authLen += 2 //add \r\n
		}

		const strRequest = [
			`${secretParams.method} ${path} HTTP/1.1`,
			`Host: ${host}`,
			...authStr,
			'Content-Length: 0',
			'\r\n'
		].join('\r\n')

		const data = Buffer.from(strRequest)
		const tokenStartIndex = data.indexOf(authStr[0])

		return {
			data,
			redactions: [
				{
					fromIndex: tokenStartIndex,
					toIndex: tokenStartIndex + authLen
				}
			]
		}
	},

	assertValidProviderReceipt(receipt, params) {
		const req = getHttpRequestHeadersFromTranscript(receipt.transcript)
		if(req.method !== params.method.toLowerCase()) {
			throw new Error(`Invalid method: ${req.method}`)
		}

		const { host, path } = parse(params.url)
		if(!host || !path) {
			throw new Error('url is incorrect')
		}

		if(req.url !== path) {
			throw new Error(`Invalid URL: ${req.url}`)
		}

		if(receipt.hostPort !== `${host}`) {
			throw new Error(`Invalid hostPort: ${receipt.hostPort}`)
		}

		const res = getCompleteHttpResponseFromTranscript(receipt.transcript)

		if(res.statusCode !== 200) {
			throw new Error(`Invalid status code: ${res.statusCode}`)
		}

		const html = res.body.toString()
		let element = ''
		if(params.responseSelection.xPath) {
			element = extractHTMLElement(html, params.responseSelection.xPath)
		} else {
			element = html
		}

		if(params.responseSelection.jsonPath) {
			element = extractJSONElement(element, params.responseSelection.jsonPath)
		}

		const regex = new RegExp(params.responseMatch)
		if(!regex.test(element)) {
			throw new Error('provider receipt is not valid')
		}
	}, /*
	getResponseRedactions(response, params) {
		qstring = qstring.toLowerCase()
		const resStr = response.toString()
		const headerEndIndex = resStr.indexOf('OK') + 2
		const regexp = new RegExp(PRODUCT_REGEXP, 'gim')

		let match: RegExpExecArray | null
		let matchIdx = -1
		let matchLength = -1
		while(match = regexp.exec(resStr)) {
			if(match[0].toLowerCase().includes(qstring)) {
				matchIdx = match.index
				matchLength = match[0].length
				break
			}
		}

		if(matchIdx === -1) {
			throw new Error('Failed to find product in response')
		}

		// add some buffer to reveal chars
		matchIdx -= REVEAL_BUFFER
		matchLength += REVEAL_BUFFER * 2

		return [
			{
				fromIndex: headerEndIndex,
				toIndex: matchIdx
			},
			{
				fromIndex: matchIdx + matchLength,
				toIndex: response.length
			}
		]
	},*/

}

export default httpProvider