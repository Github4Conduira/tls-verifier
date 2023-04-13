import type { Socket } from 'net'
import type { Logger } from 'pino'
import {
	FinaliseSessionRequest_BlockRevealDirect,
	FinaliseSessionRequest_BlockRevealZk,
	ProviderClaimData,
	TLSPacket
} from '../proto/api'

type TranscriptMessage = {
	sender: 'client' | 'server'
	packet: TLSPacket
	// eslint-disable-next-line camelcase
	directReveal?: FinaliseSessionRequest_BlockRevealDirect
	// eslint-disable-next-line camelcase
	zkReveal?: FinaliseSessionRequest_BlockRevealZk
}

export type SessionAttachedData = {
	claim?: ProviderClaimData
}

export type TLSSession = {
	id: string

	isActive: boolean

	host: string
	port: number

	socket: Socket

	transcript: TranscriptMessage[]

	logger: Logger

	ttlTimeout?: NodeJS.Timeout

	attachedData: SessionAttachedData
}

export type BufferSlice = {
	fromIndex: number
	toIndex: number
}