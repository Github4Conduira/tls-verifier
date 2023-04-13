import { BigNumber, ethers } from 'ethers'
import CONTRACTS_CONFIG from '../contracts/config.json'
import { Reclaim, Reclaim__factory as ReclaimFactory } from '../types'
import { readFile } from './files'
import { ServerError, Status } from './generics'
import logger from './logger'

const existingContractsMap: { [chain: string]: Reclaim } = { }

// default file name for extra contracts config
const EXTRA_CHAINS_FILE_NAME = './src/extra-contracts-config.json'

export type RequestClaim = {
	infoHash: string
	owner: string
	timestampS: number
	claimId: BigNumber
}

/**
 * Get details about the claim from the specified chain
 * @param chainId Chain where the claim is stored
 * @param claimId ID of the claim request
 */
export async function getClaimDataFromRequestId(
	chainId: number,
	claimId: string | number
): Promise<RequestClaim> {
	const contract = getContract(chainId)
	const pendingCreateData = await contract!.claimCreations(claimId)
	if(!pendingCreateData?.claim.claimId) {
		throw new ServerError(Status.NOT_FOUND, `Invalid request ID: ${claimId}`)
	}

	const claim = pendingCreateData.claim
	return {
		infoHash:claim.infoHash,
		owner:claim.owner.toLowerCase(),
		timestampS:claim.timestampS,
		claimId:claim.claimId
	}
}

export function getContract(chainId: number) {
	const chainKey = `0x${chainId.toString(16)}`
	if(!existingContractsMap[chainKey]) {
		const contractData = CONTRACTS_CONFIG[chainKey as keyof typeof CONTRACTS_CONFIG]
		if(!contractData) {
			throw new ServerError(Status.INVALID_ARGUMENT, `Unsupported chain: "${chainKey}"`)
		}

		const rpcProvider = new ethers.providers.JsonRpcProvider(contractData.rpcUrl)
		existingContractsMap[chainKey] = ReclaimFactory.connect(
			contractData.address,
			rpcProvider,
		)
	}

	return existingContractsMap[chainKey]
}

/**
 * Optionally load extra chains & RPC urls from a file.
 * This is useful to extend the functionality of the server
 * without having to recompile the code.
 */
export function loadExtraChains(filename: string) {
	const dataTxt = readFile(filename)
	if(!dataTxt) {
		return
	}

	const extraChains = JSON.parse(dataTxt)

	for(const chain in extraChains) {
		CONTRACTS_CONFIG[chain] = extraChains[chain]
	}

	logger.info(`injected ${Object.keys(extraChains).length} extra chains`)
}

loadExtraChains(EXTRA_CHAINS_FILE_NAME)