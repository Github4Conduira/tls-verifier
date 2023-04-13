import { randomUUID } from 'crypto'

export function unixTimestampSeconds() {
	return Math.floor(Date.now() / 1000)
}

export function createLinkId() {
	return randomUUID()
}

export function createVerificationRequestId() {
	return randomUUID()
}
