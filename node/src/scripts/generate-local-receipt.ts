import { config } from 'dotenv'

const env = process.env.NODE_ENV || 'development'
config({ path: `.env.${env}` })

import { readFile } from 'fs/promises'
import { createChannel, createClient } from 'nice-grpc'
import providers, { ProviderName, ProviderParams, ProviderSecretParams } from '../providers'
import { makeGrpcServer } from '../server/make-grpc-server'
import logger from '../utils/logger'
import { generateProviderReceipt, getTranscriptString, proto } from '..'

type ProviderReceiptGenerationParams<P extends ProviderName> = {
	name: P
	params: ProviderParams<P>
	secretParams: ProviderSecretParams<P>
}

async function main() {
	const paramsJson = await getInputParameters()
	if(!(paramsJson.name in providers)) {
		throw new Error(`Unknown provider "${paramsJson.name}"`)
	}

	const {
		client,
		server,
		channel,
	} = await makeGrpcServerAndClient()

	const { receipt } = await generateProviderReceipt({
		name: paramsJson.name,
		secretParams: paramsJson.secretParams,
		params: paramsJson.params,
		client,
		logger,
	})

	channel.close()
	await server.close()

	const transcriptStr = getTranscriptString(receipt!.transcript)
	console.log('receipt:\n', transcriptStr)

	try {
		await providers[paramsJson.name].assertValidProviderReceipt(
			receipt!,
			paramsJson.params,
		)
		console.log(`receipt is valid for ${paramsJson.name} provider`)
	} catch(err) {
		console.error(`receipt is invalid for ${paramsJson.name} provider: "${err.message}"`)
	}
}

/// Run the gRPC server and return a client
/// that can be used to connect to it
async function makeGrpcServerAndClient() {
	const port = 50051
	const server = await makeGrpcServer(port)
	const channel = createChannel('localhost:' + port)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getInputParameters(): Promise<ProviderReceiptGenerationParams<any>> {
	const paramsJsonFile = getCliArgument('json')
	if(!paramsJsonFile) {
		const name = getCliArgument('name')
		const paramsStr = getCliArgument('params')
		const secretParamsStr = getCliArgument('secretParams')
		if(!name || !paramsStr || !secretParamsStr) {
			throw new Error('Either provide --json argument for parameters JSON or provide separately with --name, --params & --secretParams')
		}

		return {
			name,
			params: JSON.parse(paramsStr),
			secretParams: JSON.parse(secretParamsStr)
		}
	}

	let fileContents = await readFile(paramsJsonFile, 'utf8')
	for(const variable in process.env) {
		fileContents = fileContents.replace(
			`{{${variable}}}`,
			process.env[variable]!
		)
	}

	return JSON.parse(fileContents)
}

function getCliArgument(arg: string) {
	const index = process.argv.indexOf(`--${arg}`)
	if(index === -1) {
		return undefined
	}

	return process.argv[index + 1]
}

main()