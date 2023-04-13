import { randomBytes } from 'crypto'
import { Socket } from 'net'
import { makeMessageProcessor } from '../tls/packets'
import { SessionAttachedData, TLSSession } from '../types/sessions'
import MAIN_LOGGER from '../utils/logger'
import storage from './storage'

const SESSION_TIMEOUT_MS = 60_000

const generateSessionId = () => (
	`${Date.now().toString(16).padStart(8, '0')}${randomBytes(8).toString('hex')}`
		.toUpperCase()
)

const newSession = async(
	host: string,
	port: number,
	attachedData: SessionAttachedData
) => {
	const id = generateSessionId()
	const logger = MAIN_LOGGER.child({ session: id })

	const socket = new Socket()
	socket.connect({ host, port })

	const processor = makeMessageProcessor(logger)

	const ttlTimeout = setTimeout(
		() => {
			if(!socket.readableEnded) {
				onEnd(new Error('timed out'))
			}

			logger.info('clearing session')

			delete storage[id]
		},
		SESSION_TIMEOUT_MS
	)

	await new Promise((resolve, reject) => {
		socket.once('connect', resolve)
		socket.once('error', reject)
		socket.once('end', () => reject(new Error('connection closed')))
	})

	socket.once('error', onEnd)
	socket.once('end', () => onEnd(undefined))

	logger.debug({ addr: `${host}:${port}` }, 'connected')

	const session: TLSSession = {
		id,
		host,
		port,
		socket,
		transcript: [],
		ttlTimeout,
		logger,
		isActive: true,
		attachedData,
	}

	socket.on('data', data => {
		processor.onData(data, (_, { header, content, authTag }) => {
			const packet = {
				recordHeader: header,
				content,
				authenticationTag: authTag || Buffer.alloc(0)
			}

			session.transcript.push({ sender: 'server', packet })

			socket.emit('server-data', packet)
		})
	})

	storage[id]	= session

	return session

	function onEnd(err: Error | undefined) {
		if(!session.isActive) {
			return
		}

		logger.info({ err }, 'session ended')
		socket.end()

		session.isActive = false
	}
}

export default newSession