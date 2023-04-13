import { TLSPacket } from '../proto/api'
import { assertActiveSession } from './assert-session'

export default async(id: string, packet: TLSPacket) => {
	const session = assertActiveSession(id)

	const { recordHeader, content, authenticationTag } = packet

	session.transcript.push({ sender: 'client', packet })

	const data = Buffer.concat([
		recordHeader,
		content,
		authenticationTag,
	])

	session.logger.trace({ data: data.toString('hex') }, 'wrote packet')

	await new Promise<void>((resolve, reject) => {
		session.socket.write(data, err => {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}