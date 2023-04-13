import { assertSession } from '../sessions/assert-session'
import { RPCPromiseHandler } from '../types/proto'

const cancelSession: RPCPromiseHandler<'cancelSession'> = async(
	{ sessionId },
	{ },
) => {
	const session = assertSession(sessionId)
	session.socket.end()

	return { }
}

export default cancelSession
