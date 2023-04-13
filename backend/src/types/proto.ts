import { AuthToken } from '@reclaimprotocol/crypto-sdk'
import type { Logger } from 'pino'
import { ReclaimBackendServiceImplementation } from '../api'
import { App as FirebaseApp } from '../firebase/index'
import { Repository } from './repository'


export type ExtraMetadata = {
	token: AuthToken
	logger: Logger
	repository: Repository
	firebaseApp: FirebaseApp
}

export type ServiceImplementation = ReclaimBackendServiceImplementation<ExtraMetadata>

export type RPCName = keyof ServiceImplementation
export type RPCPromiseHandler<R extends RPCName> = ServiceImplementation[R]


