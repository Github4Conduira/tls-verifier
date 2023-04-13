import { Socket } from 'net'
import { makeTLSClient } from '../tls'
import { verifyCertificateChain } from '../tls/parse-certificate'
import logger from '../utils/logger'

const hostPort = process.argv[2]

export async function main() {
	const [host, port] = hostPort.split(':')
	const socket = new Socket()
	const tls = makeTLSClient({
		host,
		logger,
		verifyServerCertificate: false,
		async write({ header, content, authTag }) {
			socket.write(header)
			socket.write(content)
			if(authTag) {
				socket.write(authTag)
			}
		}
	})

	tls.ev.on('recv-certificates', ({ certificates }) => {
		logger.info(
			{ rootIssuer: certificates[certificates.length - 1].internal.issuer },
			'received certificates'
		)
		try {
			verifyCertificateChain(certificates, host)
			logger.info('root CA in store. Successfully verified certificate chain')
		} catch(err) {
			logger.error({ err: err.message }, 'root CA likely not in chain')
		}
	})

	tls.ev.on('handshake', () => {
		socket.end()
		tls.end()
	})

	socket.once('connect', () => tls.startHandshake())
	socket.on('data', tls.handleRawData)

	logger.info(`connecting to ${hostPort}`)

	socket.connect({ host, port: +(port || 443) })
}

main()