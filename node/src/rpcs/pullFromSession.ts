import { PullFromSessionResponse, TLSPacket } from '../proto/api'
import { assertActiveSession } from '../sessions/assert-session'
import { RPCPromiseHandler } from '../types/proto'

// eslint-disable-next-line func-style
const pullFromSession: RPCPromiseHandler<'pullFromSession'> = async function* (
	{ sessionId },
	{ signal, logger }
) {
	const session = assertActiveSession(sessionId)

	let pendingEvents: PullFromSessionResponse[] = []

	let nextPromise: Promise<void> = Promise.resolve()
	let nextPromiseResolve: ((e: void) => void) = () => { }

	const cancel = registerForServerData(message => {
		onEventRecv({ message })
	})

	signal.addEventListener('abort', () => nextPromiseResolve(undefined))

	logger.debug('listening for events')

	while(!signal.aborted) {
		await nextPromise

		const eventsToRelease = pendingEvents
		pendingEvents = []

		if(!signal.aborted) {
			newNextPromise()

			for(const event of eventsToRelease) {
				yield event
			}
		}
	}

	try {
		await cancel()
		logger.debug('cancelled stream')
	} catch(error) {
		logger.error({ trace: error.stack }, 'failed to cancel stream')
	}

	function onEventRecv(data: PullFromSessionResponse) {
		pendingEvents.push(data)

		nextPromiseResolve()
	}

	function newNextPromise() {
		nextPromise = new Promise((resolve) => {
			nextPromiseResolve = resolve
		})
	}

	function registerForServerData(onServerData: (msg: TLSPacket) => void) {
		const socket = session.socket
		socket.on('server-data', onServerData)

		return () => {
			socket.off('server-data', onServerData)
		}
	}
}

export default pullFromSession