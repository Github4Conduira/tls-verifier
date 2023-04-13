import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { hashClaimInfo } from '@questbookapp/reclaim-crypto-sdk'
import { ethers } from 'ethers'
import { createChannel, createClient } from 'nice-grpc-web'
import { Logger } from 'pino'
import { ProviderClaimData, ReclaimWitnessDefinition } from '../proto/api'
import providers, { ProviderName, ProviderParams, ProviderSecretParams } from '../providers'
import { CreateStep, TLSConnectionOptions } from '../types'
import { ClaimCreationRequestedEventObject } from '../types/contracts/Reclaim'
import { getContract } from '../utils'
import LOGGER from '../utils/logger'
import { generateProviderReceipt } from './generate-provider-receipt'

type CreateRequestResult = {
	chainId: number
	claimId: number
	witnessHosts: string[]
}

export type CreateRequestFn = (infoHash: string, logger: Logger) => Promise<CreateRequestResult>

export interface CreateClaimOptions<N extends ProviderName> {
	/** name of the provider to generate signed receipt for */
	name: N
	/**
	 * parameters to verify the provider receipt with
	 */
	params: ProviderParams<N>
	/** additional data for signing */
	context?: string
	/**
	 * secrets that are used to make the API request;
	 * not included in the receipt & cannot be viewed by anyone
	 * outside this client
	 */
	secretParams: ProviderSecretParams<N>
	/** request creation from the smart contract or any other source */
	requestCreate: CreateRequestFn
	/** Pass to resume from a specific step */
	resumeFromStep?: CreateStep
	/** listen for when a certain step is reached */
	didUpdateCreateStep?: (step: CreateStep) => void
	additionalConnectOpts?: TLSConnectionOptions
	makeGrpcClient?: (url: string) => ReturnType<typeof createClient<ReclaimWitnessDefinition>>

	logger?: Logger
}

type SmartContractCreateOptions = {
	/** Chain ID on which to create the claim */
	chainId: number
	/** Signer to use to connect & sign transactions */
	signer: ethers.Signer
	/** If creating for another user, provide the authorisation sig */
	authorisation?: {
		signature: Uint8Array
		timestampMs: number
	}
}

/**
 * Create a claim on chain
 * @param param0 parameters to create the claim with
 */
export async function createClaim<Name extends ProviderName>({
	name,
	params,
	context,
	secretParams,
	requestCreate,
	resumeFromStep,
	didUpdateCreateStep,
	additionalConnectOpts,
	makeGrpcClient,
	logger,
}: CreateClaimOptions<Name>) {
	logger = logger || LOGGER

	if(!providers[name].areValidParams(params)) {
		throw new Error(`Invalid params for provider "${name}"`)
	}

	if(!makeGrpcClient) {
		makeGrpcClient = defaultMakeGrpcClient
	}

	additionalConnectOpts = {
		...providers[name].additionalClientOptions || {},
		...additionalConnectOpts,
	}

	let chainId: number
	let claimId: string | number
	let witnessHosts: string[]

	const claimInfo = {
		provider: name,
		parameters: JSON.stringify(params),
		context: context || ''
	}

	if(!resumeFromStep) {
		const infoHash = hashClaimInfo(claimInfo)
		const data = await requestCreate(infoHash, logger)

		chainId = data.chainId
		claimId = data.claimId
		witnessHosts = data.witnessHosts

		didUpdateCreateStep?.({
			name: 'creating',
			chainId: data.chainId,
			claimId,
			witnessHosts
		})
	} else {
		chainId = resumeFromStep.chainId
		if(resumeFromStep.name === 'creating') {
			witnessHosts = resumeFromStep.witnessHosts
			claimId = resumeFromStep.claimId
		} else {
			witnessHosts = []
			claimId = resumeFromStep.claimData.claimId
		}
	}

	logger = logger.child({ claimId: claimId.toString() })
	logger.info({ witnessHosts }, 'got claimID ID, sending requests to witnesses')

	if(!witnessHosts?.length) {
		throw new Error('No witness hosts were provided')
	}

	let claimData: ProviderClaimData
	const signatures = resumeFromStep?.name === 'witness-done'
		? [...resumeFromStep.signaturesDone]
		: []

	for(const oracleHost of witnessHosts) {
		logger.trace({ oracleHost }, 'generating signature for oracle host')

		const grpcUrl = oracleHost.startsWith('http:') || oracleHost.startsWith('https:')
			? oracleHost
			: `https://${oracleHost}`
		const { signature, claimData: r } = await generateSignature(grpcUrl)
		claimData = r!

		signatures.push(signature)

		logger.info({ oracleHost }, 'generated signature for oracle host')

		didUpdateCreateStep?.({
			name: 'witness-done',
			chainId,
			signaturesDone: signatures,
			claimData,
		})
	}

	return {
		claimId,
		claimData: claimData!,
		signatures,
		witnessHosts,
		chainId
	}

	async function generateSignature(grpcWebUrl: string) {
		// the trailing slash messes up the grpc-web client
		if(grpcWebUrl.endsWith('/')) {
			grpcWebUrl = grpcWebUrl.slice(0, -1)
		}

		const grpcClient = makeGrpcClient!(grpcWebUrl)
		const {
			claimData,
			signature,
		} = await generateProviderReceipt({
			name,
			secretParams,
			requestData: {
				chainId,
				claimId: +claimId,
				info: claimInfo
			},
			client: grpcClient,
			additionalConnectOpts,
			logger,
		})

		return {
			signature: '0x' + Buffer.from(signature).toString('hex'),
			claimData
		}
	}
}

function defaultMakeGrpcClient(url: string) {
	const grpcChannel = createChannel(url, NodeHttpTransport())
	return createClient(
		ReclaimWitnessDefinition,
		grpcChannel,
		{ }
	)
}

export function makeSmartContractCreateRequest({
	chainId,
	signer,
	authorisation,
}: SmartContractCreateOptions): CreateRequestFn {
	return async(infoHash, logger) => {
		let contract = getContract(chainId)
			.connect(signer)
		contract = contract.connect(signer.connect(contract.provider!))
		const fees = await contract.createFees()

		logger.info({ fees: ethers.utils.formatEther(fees) }, 'got create fees')

		const tx = authorisation
			? await contract.requestClaimCreateForAnother(
				authorisation.signature,
				infoHash,
				authorisation.timestampMs,
				{ value: fees }
			)
			: await contract.requestClaimCreate(
				infoHash,
				{ value: fees }
			)
		const result = await tx.wait()
		const createRequestData = result.events
			?.find(event => event.event === 'ClaimCreationRequested')
			?.args as unknown as ClaimCreationRequestedEventObject
		if(!createRequestData) {
			throw new Error(`Failed to get request data from tx: "${result.transactionHash}"`)
		}

		return {
			chainId: chainId,
			claimId: createRequestData.claimId.toNumber(),
			witnessHosts: createRequestData.witnessHosts
		}
	}
}