import type { IncomingHttpHeaders } from 'http'
import { TLSReceipt, TranscriptMessageSenderType } from '../proto/api'

type HttpRequest = {
	method: string
	url: string
	protocol: string
	headers: IncomingHttpHeaders
}

type HttpResponse = {
	statusCode: number
	statusMessage: string
	headers: IncomingHttpHeaders
	body: Buffer
	headersComplete: boolean
	complete: boolean
}

/**
 * parses http/1.1 responses
 */
export function makeHttpResponseParser() {
	/** the HTTP response data */
	const res: HttpResponse = {
		statusCode: 0,
		statusMessage: '',
		headers: {},
		body: Buffer.alloc(0),
		complete: false,
		headersComplete: false
	}

	let remainingBodyBytes = 0
	let isChunked = false
	let remaining = Buffer.alloc(0)

	return {
		res,
		/**
		 * Parse the next chunk of data
		 * @param data the data to parse
		 */
		onChunk(data: Uint8Array) {
			// concatenate the remaining data from the last chunk
			remaining = Buffer.concat([remaining, data])
			// if we don't have the headers yet, keep reading lines
			// as each header is in a line
			if(!res.headersComplete) {
				for(let line = getLine(); typeof line !== 'undefined';line = getLine()) {
					// first line is the HTTP version, status code & message
					if(!res.statusCode) {
						const [, statusCode, statusMessage] = line.match(/HTTP\/\d\.\d (\d+) (.*)/) || []
						res.statusCode = Number(statusCode)
						res.statusMessage = statusMessage
					} else if(line === '') { // empty line signifies end of headers
						res.headersComplete = true
						// if the response is chunked, we need to process the body differently
						if(res.headers['transfer-encoding']?.includes('chunked')) {
							isChunked = true
							break
						// if the response has a content-length, we know how many bytes to read
						} else if(res.headers['content-length']) {
							remainingBodyBytes = Number(res.headers['content-length'])
							break
						} else {
							// otherwise, no more data to read
							res.complete = true
						}
					} else if(!res.complete) { // parse the header
						const [key, value] = line.split(': ')
						res.headers[key.toLowerCase()] = value
					} else {
						throw new Error('got more data after response was complete')
					}
				}
			}

			if(res.headersComplete) {
				if(remainingBodyBytes) {
					readBody()
					// if no more body bytes to read,
					// and the response was not chunked we're done
					if(!remainingBodyBytes && !isChunked) {
						res.complete = true
					}
				}

				if(isChunked) {
					for(let line = getLine(); typeof line !== 'undefined'; line = getLine()) {
						if(line === '') {
							continue
						}

						const chunkSize = Number.parseInt(line, 16)
						// if chunk size is 0, we're done
						if(!chunkSize) {
							res.complete = true
							break
						}

						// otherwise read the chunk
						remainingBodyBytes = chunkSize
						readBody()

						// if we read all the data we had,
						// but there's still data left,
						// break the loop and wait for the next chunk
						if(remainingBodyBytes) {
							break
						}
					}
				}
			}
		},
		/**
		 * Call to prevent further parsing; indicating the end of the request
		 * Checks that the response is valid & complete, otherwise throws an error
		 */
		streamEnded() {
			if(!res.headersComplete) {
				throw new Error('stream ended before headers were complete')
			}

			if(remaining.length) {
				throw new Error('stream ended with remaining data')
			}

			if(remainingBodyBytes) {
				throw new Error('stream ended before all body bytes were received')
			}

			res.complete = true
		}
	}

	function readBody() {
		// take the number of bytes we need to read, or the number of bytes remaining
		// and append to the bytes of the body
		const bytesToCopy = Math.min(remainingBodyBytes, remaining.length)
		res.body = Buffer.concat([res.body, remaining.slice(0, bytesToCopy)])
		remainingBodyBytes -= bytesToCopy

		remaining = remaining.slice(bytesToCopy)
	}

	function getLine() {
		// find end of line, if it exists
		// otherwise return undefined
		const idx = remaining.indexOf('\r\n')
		if(idx === -1) {
			return undefined
		}

		const line = remaining.slice(0, idx).toString()
		remaining = remaining.slice(idx + 2)

		return line
	}
}

/**
 * Extract the HTTP response from a TLS receipt transcript.
 * Will throw an error if the response is incomplete or redacted.
 * @returns the http response
 */
export function getCompleteHttpResponseFromTranscript(
	transcript: TLSReceipt['transcript']
) {
	const serverResponseBlocks: Uint8Array[] = []
	let srvResStartIdx = -1
	for(let i = 0;i < transcript.length;i++) {
		const msg = transcript[i]
		const content = Buffer.from(msg.message).toString()
		if(
			msg.senderType === TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER
			&& content.startsWith('HTTP/')
		) {
			srvResStartIdx = i
			break
		}
	}

	if(srvResStartIdx < 0) {
		throw new Error('Could not find server response in transcript')
	}

	for(let i = srvResStartIdx;i < transcript.length;i++) {
		const msg = transcript[i]
		if(msg.senderType === TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT) {
			break
		}

		if(msg.redacted) {
			break
		}

		serverResponseBlocks.push(msg.message)
	}

	const resParser = makeHttpResponseParser()
	for(const block of serverResponseBlocks) {
		resParser.onChunk(block)
	}

	if(!resParser.res.complete) {
		throw new Error('Server response is incomplete')
	}

	return resParser.res
}

/**
 * Read the HTTP request from a TLS receipt transcript.
 * Note: this currently does not read a body, only headers.
 *
 * @param transcript the transcript to read from
 * @returns the parsed HTTP request
 */
export function getHttpRequestHeadersFromTranscript(
	transcript: TLSReceipt['transcript']
) {
	// get the first provider message sent by the client
	// to get the same, we need to skip the first two messages sent by the client
	// (the client hello and the client finish)
	const clientSentMsgs = transcript
		.filter(m => m.senderType === TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT)
		.slice(2)
	// if the first message is redacted, we can't parse it
	// as we don't know what the request was
	if(clientSentMsgs[0].redacted) {
		throw new Error('First client message request is redacted. Cannot parse')
	}

	const buffers: Uint8Array[] = []
	for(const msg of clientSentMsgs) {
		if(msg.redacted) {
			buffers.push(Buffer.from('****'))
		} else {
			buffers.push(msg.message)
		}
	}

	const request: HttpRequest = {
		method: '',
		url: '',
		protocol: '',
		headers: {},
	}

	let requestBuffer = Buffer.concat(buffers)
	// keep reading lines until we get to the end of the headers
	for(let line = getLine();typeof line !== 'undefined';line = getLine()) {
		if(line === '') {
			break
		}

		if(!request.method) {
			const [, method, url, protocol] = line.match(/(\w+) (.*) (.*)/) || []
			request.method = method.toLowerCase()
			request.url = url
			request.protocol = protocol
		} else {
			const [key, value] = line.split(': ')
			request.headers[key.toLowerCase()] = value
		}
	}

	if(!request.method) {
		throw new Error('Client request is incomplete')
	}

	return request

	function getLine() {
		const idx = requestBuffer.indexOf('\r\n')
		if(idx === -1) {
			return undefined
		}

		const line = requestBuffer.slice(0, idx).toString()
		requestBuffer = requestBuffer.slice(idx + 2)

		return line
	}
}