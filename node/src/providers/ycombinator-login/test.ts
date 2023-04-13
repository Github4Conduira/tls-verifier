import dotenv from 'dotenv'
dotenv.config({ path: '.env.sample' })

import { createChannel, createClient } from 'nice-grpc'
import { API_SERVER_PORT, makeAPITLSClient, makeGrpcServer, proto } from '../..'
import { HTTPProviderParams } from '../http/http-provider'
import providers from '..'

// User id to claim
const USER_ID = 182853

// The authentication cookie
const COOKIE_STR = '<value of your cookie copied from postman header>'


const HOST = 'bookface.ycombinator.com'
const PORT = 443
const HOSTPORT = `${HOST}:${PORT}`

const URL = `https://${HOSTPORT}/home`

async function main() {
	const { client } = await makeGrpcServerAndClient()

	console.log('booted server & got client')

	const provider = providers['yc-login']
	const [host, port] = HOSTPORT.split(':')

	const tlsClient = makeAPITLSClient({
		host,
		port: +port,
		request: {
			providerClaimRequest: undefined,
			receiptGenerationRequest: {
				host,
				port: +port,
			}
		},
		client,
		...provider.additionalClientOptions!,
		additionalConnectOpts:{ verifyServerCertificate:true },
	})

	// handle data from server
	// we'll allow all traffic to be read
	await tlsClient.handleDataFromServer(() => true)

	await tlsClient.connect()

	console.log('connected to YC')


	const params: HTTPProviderParams = {
		url:URL,
		method:'GET',
		responseSelection:{
			xPath:'//script[@id=\'js-react-on-rails-context\']',
			jsonPath:'$.currentUser.id'
		},
		responseMatch:new RegExp(`^${USER_ID}$`, 'g')
	}

	const req = provider.createRequest(
		{
			cookieStr: COOKIE_STR,
			url:params.url,
			method: params.method
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
		.assertValidProviderReceipt(receipt!, params)
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