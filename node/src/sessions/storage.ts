import { TLSSession } from '../types/sessions'

const storage: { [id: string]: TLSSession } = { }

export function closeAllSessions() {
	for(const session of Object.values(storage)) {
		session.socket.end()
		clearTimeout(session.ttlTimeout)
	}
}

export default storage