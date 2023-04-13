import { ServerError, Status } from '../utils/generics'
import storage from './storage'

export function assertSession(id: string) {
	const session = storage[id]
	if(!session) {
		throw new ServerError(Status.NOT_FOUND, 'session not found')
	}

	return session
}

export function assertActiveSession(id: string) {
	const session = assertSession(id)
	if(!session.isActive) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'session is not active')
	}

	return session
}