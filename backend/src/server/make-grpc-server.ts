import { authenticate, AuthToken } from '@reclaimprotocol/crypto-sdk'
import { randomBytes } from 'crypto'
import type { CallContext, ServerMiddlewareCall } from 'nice-grpc'
import { ServerError, Status } from 'nice-grpc'
import { ReclaimBackendDefinition } from '../api'
import { DEFAULT_PORT } from '../config'
import { firebaseApp } from '../firebase'
import { makeRepository } from '../repository'
import rpcs from '../rpcs'
import { ExtraMetadata, RPCName } from '../types'
import MAIN_LOGGER from '../utils/logger'

const serverLogger = MAIN_LOGGER.child({ stream: 'server' })

export async function makeGrpcServer(port = DEFAULT_PORT) {
	const { createServer } = await import('nice-grpc')
	const server = createServer()
		.use(validateRPC)
	server.add(ReclaimBackendDefinition, rpcs)

	await server.listen(`0.0.0.0:${port}`)

	serverLogger.info(`server listening on port ${port}`)

	const repo = await makeRepository()

	return {
		close: async() => {
			await server.shutdown()
			await repo.close()
		}
	}
}


function rpcRequiresAuthentication(rpc: RPCName) {
	return rpc.toLowerCase() !== 'healthcheck'
}

async function* validateRPC<Req, Res>(
	req: ServerMiddlewareCall<Req, Res, ExtraMetadata>,
	ctx: CallContext
) {
	// last component of path is the RPC name
	const name = req.method.path.split('/').pop() as RPCName
	const requestId = randomBytes(4).toString('hex')
	// include the RPC name and request ID
	// in every log done by this RPC
	let logger = serverLogger.child({ name, requestId })

	logger.info('started')
	const repo = await makeRepository()

	try {
		const isAuthRequired = rpcRequiresAuthentication(name)
		let token: AuthToken | undefined
		if(isAuthRequired) {
			// do authentication
			const auth = ctx.metadata.get('Authorization')
			if(!auth) {
				throw new ServerError(Status.UNAUTHENTICATED, 'authorization token is missing')
			}

			try {
				token = await authenticate(auth)
			} catch(error) {
				throw new ServerError(Status.UNAUTHENTICATED, error.message)
			}

			logger = logger.child({ user: token?.id })
		}

		const result = yield* req.next(
			req.request,
			{ ...ctx, logger, token: token!, repository: repo, firebaseApp }
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

