import writeToSession from '../sessions/write-to-session'
import { RPCPromiseHandler } from '../types/proto'

const pushToSession: RPCPromiseHandler<'pushToSession'> = async(
	{ sessionId, messages },
	{ },
) => {
	for(const message of messages) {
		await writeToSession(sessionId, message)
	}

	return { }
}

export default pushToSession
