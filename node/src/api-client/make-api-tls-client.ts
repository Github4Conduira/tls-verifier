import { makeZKOperatorFromJson, ZKOperator } from '@questbook/reclaim-zk'
import { Logger } from 'pino'
import { FinaliseSessionRequest_Block, InitialiseSessionRequest, PullFromSessionResponse, PushToSessionRequest, ReclaimWitnessClient, TlsCipherSuiteType } from '../proto/api'
import { makeTLSClient } from '../tls'
import { SUPPORTED_CIPHER_SUITE_MAP } from '../tls/constants'
import { generateIV } from '../tls/wrapped-record'
import { TLSConnectionOptions, TLSEventMap, TLSPresharedKey } from '../types'
import { BufferSlice } from '../types/sessions'
import MAIN_LOGGER from '../utils/logger'
import { prepareZkProofs } from '../utils/zk'

export type APITLSClientOptions = {
	host: string
	port: number
	client: ReclaimWitnessClient
	/** return the sections of the response to redact */
	redactResponse?(data: Buffer): BufferSlice[]
	request?: InitialiseSessionRequest
	logger?: Logger
	additionalConnectOpts?: TLSConnectionOptions
	zkOperator?: ZKOperator
}

// eslint-disable-next-line camelcase
type BlockToReveal = Partial<FinaliseSessionRequest_Block>

type ServerBlock = BlockToReveal & {
	plaintext: Buffer
	ciphertext: Buffer
}

const EMPTY_BUFFER = Buffer.alloc(0)

export const makeAPITLSClient = ({
	host,
	port,
	client,
	redactResponse,
	request,
	logger: _logger,
	additionalConnectOpts,
	zkOperator
}: APITLSClientOptions) => {
	let sessionId: string | undefined
	let abort: AbortController | undefined

	let pendingReveal = false
	let psk: TLSPresharedKey | undefined

	const logger = _logger || MAIN_LOGGER?.child({ })
	const { generateOutOfBandSession } = additionalConnectOpts || {}

	const blocksToReveal: BlockToReveal[] = []
	const allServerBlocks: ServerBlock[] = []
	// we'll only support chacha20-poly1305 for API sessions
	const cipherSuites: (keyof typeof SUPPORTED_CIPHER_SUITE_MAP)[]
		= ['TLS_CHACHA20_POLY1305_SHA256']

	const tls = makeTLSClient({
		host,
		logger,
		cipherSuites,
		...additionalConnectOpts || {},
		async write({ header, content, authTag }) {
			if(!sessionId) {
				throw new Error('Too early to write')
			}

			if(pendingReveal && authTag?.length) {
				const keys = tls.getKeys()!
				const key = keys.clientEncKey
				const iv = generateIV(keys.clientIv, keys.recordSendCount - 1)

				blocksToReveal.push({
					authTag,
					directReveal: {
						key,
						iv
					}
				})
				pendingReveal = false
			}

			const req: PushToSessionRequest = {
				sessionId,
				messages: [
					{
						recordHeader: header,
						content,
						authenticationTag: authTag || EMPTY_BUFFER
					}
				]
			}
			await client.pushToSession(req)

			logger.debug(
				{ sessionId, length: content.length },
				'pushed data'
			)
		}
	})

	async function listenToDataFromServer(result: AsyncIterable<PullFromSessionResponse>) {
		try {
			for await (const { message } of result) {
				const type = message!.recordHeader[0]
				tls.processPacket(type, {
					header: Buffer.from(message!.recordHeader),
					content: Buffer.from(message!.content),
					authTag: Buffer.from(message!.authenticationTag)
				})
			}
		} catch(error) {
			if(!error.message.includes('aborted')) {
				throw error
			}
		}
	}

	async function writeWithReveal(data: Buffer, reveal: boolean) {
		if(!reveal) {
			await tls.updateTrafficKeys()
		}

		if(reveal) {
			pendingReveal = true
		}

		await tls.write(data)

		if(!reveal) {
			await tls.updateTrafficKeys()
		}
	}

	async function generatePSK() {
		const { Socket } = await import('net')
		const socket = new Socket()
		const tls = makeTLSClient({
			host,
			logger,
			cipherSuites,
			...additionalConnectOpts || {},
			async write({ header, content, authTag }) {
				socket.write(header)
				socket.write(content)
				if(authTag) {
					socket.write(authTag)
				}
			}
		})

		socket.once('connect', () => tls.startHandshake())
		socket.on('data', tls.handleRawData)

		socket.connect({ host, port })

		const newPsk = new Promise<TLSPresharedKey>(resolve => {
			tls.ev.once('session-ticket', ticket => {
				resolve(tls.getPskFromTicket(ticket))
			})
		})

		await new Promise((resolve, reject) => {
			socket.once('error', reject)
			tls.ev.once('handshake', resolve)
		})

		logger.info('waiting for TLS ticket')

		psk = await newPsk

		logger.info('got TLS ticket, ending session...')
		socket.end()
		tls.end()
	}

	return {
		generatePSK,
		/**
		 * handle data received from the server
		 * @param clb handle data, return if the block should be revealed or not
		 */
		async handleDataFromServer(clb: (data: Buffer) => void) {
			tls.ev.on('data', handlePlaintext)

			return () => {
				tls.ev.off('data', handlePlaintext)
			}

			function handlePlaintext(
				{
					plaintext,
					ciphertext,
					authTag
				}: TLSEventMap['data']
			) {
				const keys = tls.getKeys()!
				const key = keys.serverEncKey
				const iv = generateIV(keys.serverIv, keys.recordRecvCount - 1)

				allServerBlocks.push({
					authTag,
					directReveal: { key, iv },
					plaintext,
					ciphertext,
				})
				clb(plaintext)
			}
		},
		async connect() {
			if(!psk && generateOutOfBandSession) {
				await generatePSK()
			}

			let initialiseSessionParams = request
			if(
				!initialiseSessionParams?.providerClaimRequest
				&& !initialiseSessionParams?.receiptGenerationRequest
			) {
				initialiseSessionParams = {
					receiptGenerationRequest: {
						host,
						port
					},
					providerClaimRequest: undefined,
				}
			}

			logger.trace('initialising...')

			const res = await client.initialiseSession(initialiseSessionParams)
			sessionId = res.sessionId
			abort = new AbortController()

			logger.debug({ sessionId }, 'initialised session')

			const pullResult = await client.pullFromSession(
				{ sessionId },
				{ signal: abort?.signal }
			)

			logger.debug('pulling from session')

			const evPromise = listenToDataFromServer(pullResult)
			tls.startHandshake({ psk })

			await Promise.race([
				evPromise,
				new Promise(resolve => {
					tls.ev.on('handshake', resolve)
				})
			])

			if(!tls.isHandshakeDone()) {
				throw new Error('Handshake failed')
			}

			return () => {
				abort?.abort()
			}
		},
		async cancel() {
			if(!sessionId) {
				throw new Error('Nothing to cancel')
			}

			abort?.abort()
			await client.cancelSession({ sessionId })

			await tls.end()
		},
		async finish() {
			if(!sessionId) {
				throw new Error('Nothing to cancel')
			}

			if(redactResponse) {
				const zkBlocks = await prepareZkProofs(
					{
						blocks: allServerBlocks,
						operator: zkOperator || makeZKOperatorFromJson(logger),
						redact: redactResponse,
						logger,
					}
				)

				// if all blocks should be revealed, reveal them all
				if(zkBlocks === 'all') {
					blocksToReveal.push(...allServerBlocks)
				} else {
					for(const { block } of zkBlocks) {
						blocksToReveal.push(block)
					}
				}
			} else {
				blocksToReveal.push(...allServerBlocks)
			}

			abort?.abort()
			const result = await client.finaliseSession({
				sessionId,
				revealBlocks: blocksToReveal,
				cipherSuite: TlsCipherSuiteType
					.TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256
			})

			tls.end()

			return result
		},
		async write(data: Buffer, redactedSections: BufferSlice[]) {
			for(let i = 0;i < redactedSections.length;i++) {
				const section = redactedSections[i]
				const block = data.slice(0, section.fromIndex)
				if(block.length) {
					await writeWithReveal(block, true)
				}

				const redacted = data.slice(section.fromIndex, section.toIndex)
				await writeWithReveal(redacted, false)
			}

			const block = data.slice(redactedSections[redactedSections.length - 1].toIndex)
			if(block.length) {
				await writeWithReveal(block, true)
			}
		}
	}
}