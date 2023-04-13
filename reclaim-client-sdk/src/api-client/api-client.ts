import { generateAuthToken } from '@reclaimprotocol/crypto-sdk'
import { createChannel, createClient, Metadata } from 'nice-grpc-web'
import {ReclaimBackendDefinition} from '../proto'
import { BACKEND_URL } from '../config'

async function makeGrpcClient(privateKey: string) {
	// grpc-web channel
	// both the witness & backend can be accessed from this URL
	const channel = createChannel(BACKEND_URL)
	// metadata for auth token
	const metadata = new Metadata()

	const token = await generateAuthToken(privateKey)
	metadata.set('Authorization', token)
	// actual client to communicate with backend
	const client = createClient(
		ReclaimBackendDefinition,
		channel,
		{ '*': { metadata } }
	)

	return client
}

export {makeGrpcClient}
