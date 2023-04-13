import { randomBytes } from 'crypto'
import type { CallContext, ServerMiddlewareCall } from 'nice-grpc'
import { API_SERVER_PORT, PRIVATE_KEY } from '../config'
import { ReclaimWitnessDefinition } from '../proto/api'
import rpcs from '../rpcs'
import { closeAllSessions } from '../sessions/storage'
import { SelectedServiceSignature } from '../signatures'
import { ExtraMetadata, RPCName } from '../types/proto'
import { ServerError, Status } from '../utils/generics'
import MAIN_LOGGER from '../utils/logger'

const serverLogger = MAIN_LOGGER.child({ stream: 'server' })

export async function makeGrpcServer(port = API_SERVER_PORT) {
	const { createServer } = await import('nice-grpc')
	const server = createServer()
		.use(validateRPC)
	server.add(ReclaimWitnessDefinition, rpcs)

	await server.listen(`0.0.0.0:${port}`)

	const publicKey = await SelectedServiceSignature.getPublicKey(
		PRIVATE_KEY
	)
	const address = SelectedServiceSignature.getAddress(publicKey)
	const publicKeyHex = Buffer.from(publicKey).toString('hex')
	serverLogger.info({ port, publicKeyHex, address }, 'booted server')

	return {
		close: async() => {
			await server.shutdown()
			await closeAllSessions()
		}
	}
}

async function* validateRPC<Req, Res>(
	req: ServerMiddlewareCall<Req, Res, ExtraMetadata>,
	ctx: CallContext
) {
	// last component of path is the RPC name
	const name = req.method.path.split('/').pop() as RPCName
	const requestId = randomBytes(4).toString('hex')
	const logger = serverLogger.child({ name, requestId })

	logger.info('started')

	try {
		const result = yield* req.next(
			req.request,
			{ ...ctx, logger }
		)

		logger.info('finished')

		return result
	} catch(error) {
		logger.error({
			trace: error.stack,
			code: error.code,
			req: req.request,
		}, 'error in RPC')
		if(error instanceof ServerError) {
			throw error
		}

		throw new ServerError(
			Status.INTERNAL,
			`Internal(${error.message})`
		)
	}
}