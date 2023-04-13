import dotenv from 'dotenv'
dotenv.config({ path: '.env.sample' })

import { createChannel, createClient } from 'nice-grpc'
import { API_SERVER_PORT, DEFAULT_PORT, makeAPITLSClient, makeGrpcServer, proto } from '../..'
import providers from '..'

// User id to claim
const USER_ID = 182853

// The authentication cookie
const COOKIE_STR = '<your cookie string here>'


async function main() {
	const { client } = await makeGrpcServerAndClient()

	console.log('booted server & got client')

	const provider = providers['yc-login']
	const [host] = (typeof provider.hostPort === 'string' ? provider.hostPort : '').split(':')

	const tlsClient = makeAPITLSClient({
		host,
		port: DEFAULT_PORT,
		request: {
			providerClaimRequest: undefined,
			receiptGenerationRequest: {
				host,
				port: DEFAULT_PORT,
			}
		},
		client,
		...provider.additionalClientOptions!,
		// Cancel certificate verification for now
		 additionalConnectOpts:{ verifyServerCertificate:true }
		// rootCAs:[cert]
	})

	// handle data from server
	// we'll allow all traffic to be read
	await tlsClient.handleDataFromServer(() => true)

	await tlsClient.connect()

	console.log('connected to YC')

	const req = provider.createRequest(
		{
			cookieStr: COOKIE_STR
		},
		{
			userId:USER_ID
		}
	)

	// send the request to YC
	await tlsClient.write(req.data, req.redactions)

	// wait for all the data
	// (hacky way to do this, isn't actually used in prod)
	await new Promise(resolve => setTimeout(resolve, 4_000))

	// finally, end the session & generate the receipt
	const { receipt } = await tlsClient.finish()

	console.log('Retrieved the receipt')

	await provider
		.assertValidProviderReceipt(receipt!, {
			userId: USER_ID,
		})
	console.log(`Validated the receipt for user id: ${USER_ID}`)
}

/// Run the gRPC server and return a client
/// that can be used to connect to it
async function makeGrpcServerAndClient() {
	const server = await makeGrpcServer()
	const channel = createChannel('localhost:' + API_SERVER_PORT)
	const client = createClient(
		proto.ReclaimWitnessDefinition,
		channel,
		{ }
	)

	return {
		server,
		channel,
		client
	}
}

main()