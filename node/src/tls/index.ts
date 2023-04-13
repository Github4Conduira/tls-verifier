import { randomBytes } from 'crypto'
import EventEmitter from 'events'
import { ProcessPacket, TLSClientOptions, TLSEventEmitter, TLSHandshakeOptions, TLSSessionTicket, X509Certificate } from '../types'
import { computeSharedKeys, computeSharedMasterKey, computeUpdatedTrafficMasterSecret, deriveTrafficKeysForSide, SharedKeyData } from '../utils'
import { toHexStringWithWhitespace } from '../utils'
import { generateX25519KeyPair } from '../utils'
import LOGGER from '../utils/logger'
import { makeQueue } from '../utils/make-queue'
import { packClientHello } from './client-hello'
import { AUTH_TAG_BYTE_LENGTH, CONTENT_TYPE_MAP, PACKET_TYPE, SUPPORTED_CIPHER_SUITE_MAP, SUPPORTED_RECORD_TYPE_MAP } from './constants'
import { packFinishMessagePacket, verifyFinishMessage } from './finish-messages'
import { packKeyUpdateRecord } from './key-update'
import { makeMessageProcessor, PacketOptions, packPacketHeader, readWithLength } from './packets'
import { parseTlsAlert } from './parse-alert'
import { parseCertificates, parseServerCertificateVerify, verifyCertificateChain, verifyCertificateSignature } from './parse-certificate'
import { parseServerHello } from './parse-server-hello'
import { getPskFromTicket, parseSessionTicket } from './session-ticket'
import { decryptWrappedRecord, encryptWrappedRecord } from './wrapped-record'

const RECORD_LENGTH_BYTES = 3

type Record = {
	record: Buffer
	contentType: number | undefined
	authTag: Buffer | undefined
	ciphertext: Buffer | undefined
}

export function makeTLSClient({
	host,
	verifyServerCertificate,
	rootCAs,
	logger: _logger,
	cipherSuites,
	crypto,
	write
}: TLSClientOptions) {
	verifyServerCertificate = verifyServerCertificate !== false

	const logger = _logger || LOGGER?.child({ })
	const ev = new EventEmitter() as TLSEventEmitter
	const keyPair = generateX25519KeyPair()
	const processor = makeMessageProcessor(logger)
	const { enqueue: enqueueServerPacket } = makeQueue()

	let handshakeDone = false
	let ended = false

	let sessionId = Buffer.alloc(0)
	let handshakeMsgs: Buffer[] = []
	let cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP | undefined = undefined
	let earlySecret: Buffer | undefined = undefined
	let keys: SharedKeyData | undefined = undefined
	let recordSendCount = 0
	let recordRecvCount = 0

	let certificates: X509Certificate[] = []

	const processPacket: ProcessPacket = (type, { header, content, authTag }) => {
		return enqueueServerPacket(async() => {
			if(ended) {
				logger.warn('connection closed, ignoring packet')
				return
			}

			let data = content
			let contentType: number | undefined
			let ciphertext: Buffer | undefined
			switch (type) {
			case PACKET_TYPE.HELLO:
				break
			case PACKET_TYPE.WRAPPED_RECORD:
				logger.trace('recv wrapped record')
				const decrypted = decryptWrappedRecord(
					content,
					{
						authTag,
						key: keys!.serverEncKey,
						iv: keys!.serverIv,
						recordHeader: header,
						recordNumber: recordRecvCount,
						cipherSuite: cipherSuite!,
						crypto,
					}
				)
				data = decrypted.plaintext
				// exclude final byte (content type)
				ciphertext = content.slice(0, -1)
				contentType = decrypted.contentType

				logger.debug(
					{ recordRecvCount, contentType: contentType.toString(16) },
					'decrypted wrapped record'
				)
				recordRecvCount += 1
				break
			case PACKET_TYPE.CHANGE_CIPHER_SPEC:
				// TLS 1.3 doesn't really have a change cipher spec
				// this is just for compatibility with TLS 1.2
				// so we do nothing here, and return
				return
			case PACKET_TYPE.ALERT:
				const { level, description } = parseTlsAlert(content)
				logger[level === 'WARNING' ? 'warn' : 'error'](
					{ level, description },
					'received alert'
				)
				if(level === 'FATAL') {
					end()
				}

				return
			default:
				logger.warn(
					{ type: type.toString(16), chunk: toHexStringWithWhitespace(content) },
					'cannot process message'
				)
				return
			}

			try {
				await processRecord({
					record: data,
					contentType,
					authTag,
					ciphertext,
				})
			} catch(err) {
				logger.error({ err }, 'error processing record')
				ev.emit('error', err)
				end()
			}
		})
	}

	async function processRecord(
		{
			record,
			contentType,
			authTag,
			ciphertext
		}: Record
	) {
		if(!contentType || contentType === CONTENT_TYPE_MAP.HANDSHAKE) {
			let data = readPacket()
			while(data) {
				const { type, content } = data
				switch (type) {
				case SUPPORTED_RECORD_TYPE_MAP.SERVER_HELLO:
					logger.trace('received server hello')

					const hello = parseServerHello(content)
					const masterKey = computeSharedMasterKey(keyPair.privKey, hello.publicKey)

					if(!hello.supportsPsk && earlySecret) {
						throw new Error('Server does not support PSK')
					}

					cipherSuite = hello.cipherSuite

					keys = computeSharedKeys({
						hellos: handshakeMsgs,
						cipherSuite: hello.cipherSuite,
						secretType: 'hs',
						masterSecret: masterKey,
						earlySecret,
					})

					logger.debug(
						{ cipherSuite },
						'processed server hello & computed shared keys'
					)
					break
				case SUPPORTED_RECORD_TYPE_MAP.ENCRYPTED_EXTENSIONS:
					logger.debug({ len: content.length }, 'received encrypted extensions')
					break
				case SUPPORTED_RECORD_TYPE_MAP.CERTIFICATE:
					logger.debug({ len: content.length }, 'received certificate')
					const result = parseCertificates(content)
					certificates = result.certificates
					break
				case SUPPORTED_RECORD_TYPE_MAP.CERTIFICATE_VERIFY:
					logger.debug({ len: content.length }, 'received certificate verify')
					const signature = parseServerCertificateVerify(content)

					if(!certificates.length) {
						throw new Error('No certificates received')
					}

					await verifyCertificateSignature({
						...signature,
						publicKey: certificates[0].getPublicKey(),
						hellos: handshakeMsgs.slice(0, -1),
						cipherSuite: cipherSuite!
					})

					ev.emit('recv-certificates', { certificates })

					if(verifyServerCertificate) {
						await verifyCertificateChain(certificates, host, rootCAs)
					}

					break
				case SUPPORTED_RECORD_TYPE_MAP.FINISHED:
					await processServerFinish(content)
					break
				case SUPPORTED_RECORD_TYPE_MAP.KEY_UPDATE:
					const newMasterSecret = computeUpdatedTrafficMasterSecret(
						keys!.serverSecret,
						cipherSuite!
					)
					const newKeys = deriveTrafficKeysForSide(newMasterSecret, cipherSuite!)
					keys = {
						...keys!,
						serverSecret: newMasterSecret,
						serverEncKey: newKeys!.encKey,
						serverIv: newKeys!.iv,
					}

					recordRecvCount = 0
					logger.debug('updated server traffic keys')
					break
				case SUPPORTED_RECORD_TYPE_MAP.SESSION_TICKET:
					logger.debug({ len: record.length }, 'received session ticket')
					const ticket = parseSessionTicket(content)
					ev.emit('session-ticket', ticket)
					break
				default:
					logger.warn({ type: type.toString(16) }, 'cannot process record')
					break
				}

				data = readPacket()
			}

			function readPacket() {
				if(!record.length) {
					return
				}

				const type = record[0]
				const lengthBytes = RECORD_LENGTH_BYTES
				const content = readWithLength(record.slice(1), lengthBytes)
				const totalLength = 1 + lengthBytes + content.length
				if(!handshakeDone) {
					handshakeMsgs.push(record.slice(0, totalLength))
				}

				record = record.slice(totalLength)

				return { type, content }
			}
		} else if(contentType === CONTENT_TYPE_MAP.APPLICATION_DATA) {
			logger.trace({ len: record.length }, 'received application data')
			ev.emit('data', {
				plaintext: record,
				authTag: authTag!,
				ciphertext: ciphertext!,
			})
		} else if(contentType === CONTENT_TYPE_MAP.ALERT) {
			logger.error({ record }, 'recv alert')
		} else {
			logger.warn(
				{ record: record.toString('hex'), contentType: contentType.toString(16) },
				'cannot process record'
			)
		}
	}

	async function processServerFinish(serverFinish: Buffer) {
		logger.debug('received finished')
		// the server hash computation does not include
		// the server finish, so we need to exclude it
		const handshakeMsgsForServerHash = handshakeMsgs.slice(0, -1)

		verifyFinishMessage(serverFinish, {
			secret: keys!.serverSecret,
			handshakeMessages: handshakeMsgsForServerHash,
			cipherSuite: cipherSuite!
		})

		logger.debug('server finish verified')

		const clientFinish = packFinishMessagePacket({
			secret: keys!.clientSecret,
			handshakeMessages: handshakeMsgs,
			cipherSuite: cipherSuite!
		})

		logger.trace(
			{ finish: toHexStringWithWhitespace(clientFinish) },
			'sending client finish'
		)

		await writeEncryptedPacket({
			type: 'WRAPPED_RECORD',
			data: clientFinish,
			contentType: 'HANDSHAKE'
		})

		// switch to using the provider keys
		keys = computeSharedKeys({
			// we only use handshake messages till the server finish
			hellos: handshakeMsgs,
			cipherSuite: cipherSuite!,
			secretType: 'ap',
			masterSecret: keys!.masterSecret,
		})

		// also the send/recv counters are reset
		// once we switch to the provider keys
		recordSendCount = 0
		recordRecvCount = 0

		// add the client finish to the handshake messages
		handshakeMsgs.push(clientFinish)

		handshakeDone = true
		ev.emit('handshake', undefined)
	}

	async function writeEncryptedPacket(opts: PacketOptions & { contentType: keyof typeof CONTENT_TYPE_MAP }) {
		// total length = data len + 1 byte for record type + auth tag len
		const dataLen = opts.data.length + 1 + AUTH_TAG_BYTE_LENGTH
		const header = packPacketHeader(dataLen, opts)

		logger.trace({ recordSendCount, contentType: opts.contentType }, 'sending enc data')

		const { ciphertext, authTag } = encryptWrappedRecord(
			{ plaintext: opts.data, contentType: opts.contentType },
			{
				key: keys!.clientEncKey,
				iv: keys!.clientIv,
				recordHeader: header,
				recordNumber: recordSendCount,
				cipherSuite: cipherSuite!,
				crypto
			}
		)

		recordSendCount += 1

		await write({ header, content: ciphertext, authTag })
	}

	async function writePacket(opts: PacketOptions) {
		const header = packPacketHeader(opts.data.length, opts)
		await write({ header, content: opts.data })
	}

	async function end() {
		await enqueueServerPacket(() => { })
		handshakeDone = false
		handshakeMsgs = []
		cipherSuite = undefined
		keys = undefined
		recordSendCount = 0
		recordRecvCount = 0
		earlySecret = undefined
		processor.reset()

		ended = true
	}

	return {
		ev,
		hasEnded() {
			return ended
		},
		getKeyPair() {
			return keyPair
		},
		getKeys() {
			if(!keys) {
				return undefined
			}

			return { ...keys, recordSendCount, recordRecvCount }
		},
		getSessionId() {
			return sessionId
		},
		isHandshakeDone() {
			return handshakeDone
		},
		getPskFromTicket(ticket: TLSSessionTicket) {
			return getPskFromTicket(ticket, {
				masterKey: keys!.masterSecret,
				hellos: handshakeMsgs,
				cipherSuite: cipherSuite!,
			})
		},
		async startHandshake(opts?: TLSHandshakeOptions) {
			if(handshakeDone) {
				throw new Error('Handshake already done')
			}

			sessionId = randomBytes(32)
			ended = false

			const clientHello = packClientHello({
				host,
				publicKey: keyPair.pubKey,
				random: opts?.random || randomBytes(32),
				sessionId,
				psk: opts?.psk,
				cipherSuites
			})
			handshakeMsgs.push(clientHello)

			if(opts?.psk) {
				earlySecret = opts.psk.earlySecret
			}

			logger.trace(
				{ hello: toHexStringWithWhitespace(clientHello) },
				'sent client hello'
			)
			await writePacket({
				type: 'HELLO',
				data: clientHello,
			})
		},
		handleRawData(data: Buffer) {
			if(ended) {
				return
			}

			processor.onData(data, processPacket)
		},
		async updateTrafficKeys(requestUpdateFromServer = false) {
			const packet = packKeyUpdateRecord(
				requestUpdateFromServer
					? 'UPDATE_REQUESTED'
					: 'UPDATE_NOT_REQUESTED'
			)
			await writeEncryptedPacket({
				data: packet,
				type: 'WRAPPED_RECORD',
				contentType: 'HANDSHAKE'
			})

			const newMasterSecret = computeUpdatedTrafficMasterSecret(
				keys!.clientSecret,
				cipherSuite!
			)
			const newKeys = deriveTrafficKeysForSide(newMasterSecret, cipherSuite!)
			keys = {
				...keys!,
				clientSecret: newMasterSecret,
				clientEncKey: newKeys!.encKey,
				clientIv: newKeys!.iv,
			}

			recordSendCount = 0

			logger.info('updated client traffic keys')
		},
		processPacket,
		write(data: Buffer) {
			if(!handshakeDone) {
				throw new Error('Handshake not done')
			}

			return writeEncryptedPacket({
				type: 'WRAPPED_RECORD',
				data,
				contentType: 'APPLICATION_DATA'
			})
		},
		end,
	}
}