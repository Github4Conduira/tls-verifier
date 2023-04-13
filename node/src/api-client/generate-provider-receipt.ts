import { Logger } from 'pino'
import { ReclaimWitnessClient } from '../proto/api'
import { InitialiseSessionRequest_ProviderClaimRequest as ProviderClaimRequest } from '../proto/api'
import providers, { ProviderName, ProviderSecretParams } from '../providers'
import { TLSConnectionOptions } from '../types'
import { makeHttpResponseParser } from '../utils/http-parser'
import MAIN_LOGGER from '../utils/logger'
import { makeAPITLSClient } from './make-api-tls-client'

export interface GenerateProviderReceiptOptions<N extends ProviderName> {
	/** name of the provider to generate signed receipt for */
	name: N
	/**
	 * secrets that are used to make the API request;
	 * not included in the receipt & cannot be viewed by anyone
	 * outside this client
	 */
	secretParams: ProviderSecretParams<N>
	requestData?: ProviderClaimRequest
	client: ReclaimWitnessClient
	additionalConnectOpts?: TLSConnectionOptions
	logger?: Logger
}

export async function generateProviderReceipt<Name extends ProviderName>({
	name,
	secretParams,
	client,
	requestData,
	additionalConnectOpts,
	logger,
}: GenerateProviderReceiptOptions<Name>) {
	logger = logger || MAIN_LOGGER
	const provider = providers[name]
	const [host, port] = provider.hostPorts[0].split(':')

	additionalConnectOpts = additionalConnectOpts || { }
	if(provider.additionalClientOptions?.rootCAs) {
		additionalConnectOpts.rootCAs = [
			...(additionalConnectOpts.rootCAs || [ ]),
			...provider.additionalClientOptions.rootCAs,
		]
	}

	const apiClient = makeAPITLSClient({
		host,
		port: port ? +port : 443,
		request: {
			providerClaimRequest: requestData,
			receiptGenerationRequest: undefined
		},
		client,
		logger,
		additionalConnectOpts,
		redactResponse:
			provider.getResponseRedactions
				? res => {
					// @ts-ignore
					return provider.getResponseRedactions!(res, secretParams)
				}
				: undefined
	})
	const resParser = makeHttpResponseParser()

	let endedHttpRequest: (() => void) | undefined

	apiClient.handleDataFromServer(data => {
		resParser.onChunk(data)
		if(resParser.res.complete) {
			process.nextTick(() => {
				endedHttpRequest?.()
			})
		}
	})

	const request = provider.createRequest(
		// @ts-ignore
		secretParams
	)

	logger.debug(
		{ redactions: request.redactions.length },
		'generated request'
	)

	await apiClient.connect()
	await apiClient.write(request.data, request.redactions)

	logger.info('wrote request to server')

	const waitForRequestEnd = new Promise<void>(
		(resolve) => {
			endedHttpRequest = resolve
		}
	)
	await waitForRequestEnd

	const res = await apiClient.finish()

	logger.info({ claimData: res.claimData }, 'finished request')

	return res
}