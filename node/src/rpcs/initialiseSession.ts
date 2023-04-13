import { hashClaimInfo } from '@reclaimprotocol/crypto-sdk'
import { ProviderClaimData } from '../proto/api'
import providers from '../providers'
import newSession from '../sessions/new-session'
import { RPCPromiseHandler } from '../types'
import { SessionAttachedData } from '../types/sessions'
import { ServerError, Status } from '../utils'
import { getClaimDataFromRequestId } from '../utils'

const initialiseSession: RPCPromiseHandler<'initialiseSession'> = async(
	{ receiptGenerationRequest, providerClaimRequest },
) => {
	let host: string
	let port: number
	let attachedData: SessionAttachedData
	if(receiptGenerationRequest?.host) {
		host = receiptGenerationRequest.host
		port = receiptGenerationRequest.port
		attachedData = { }
	} else if(providerClaimRequest?.claimId) {
		const info = providerClaimRequest.info!
		const claimData = await getClaimDataFromRequestId(
			providerClaimRequest.chainId,
			providerClaimRequest.claimId
		)

		const hash = hashClaimInfo(info)
		if(hash !== claimData.infoHash) {
			throw new ServerError(Status.INVALID_ARGUMENT, `Claim info hash mismatch, expected ${claimData.infoHash}, got ${hash}`)
		}

		const res = validateProviderAndJsonParams(info.provider, info.parameters)
		const claim: ProviderClaimData = {
			provider: info.provider,
			parameters: info.parameters,
			context: info.context,
			claimId: +claimData.claimId.toString(),
			timestampS: claimData.timestampS,
			owner: claimData.owner.toLowerCase(),
		}
		host = res.host
		port = res.port
		attachedData = { claim }
	} else {
		throw new ServerError(Status.INVALID_ARGUMENT, 'Need either a receiptGenerationRequest or providerClaimRequest or simulationRequest')
	}

	const { id } = await newSession(host, port, attachedData)

	return { sessionId: id }
}

function validateProviderAndJsonParams(provider, jsonParams) {

	if(!(provider in providers)) {
		throw new ServerError(Status.FAILED_PRECONDITION, `Provider not found: '${provider}'`)
	}

	const prov = providers[provider as keyof typeof providers]

	const params = JSON.parse(jsonParams)
	if(!prov.areValidParams(params)) {
		throw new ServerError(Status.INVALID_ARGUMENT, `Invalid params: ${jsonParams}`)
	}

	// @ts-ignore
	const hostPort = prov.hostPort instanceof Function ? prov.hostPort(params) : prov.hostPort
	const splitResult = hostPort.split(':')

	return {
		host: splitResult[0],
		port: +splitResult[1],
	}


}

export default initialiseSession
