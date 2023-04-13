import type { Logger } from 'pino'
import { ReclaimWitnessServiceImplementation } from '../proto/api'

export type ExtraMetadata = {
	logger: Logger
}

export type ServiceImplementation = ReclaimWitnessServiceImplementation<ExtraMetadata>

export type RPCName = keyof ServiceImplementation
export type RPCPromiseHandler<R extends RPCName> = ServiceImplementation[R]