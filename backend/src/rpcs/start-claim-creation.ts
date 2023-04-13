import { getContract } from '@questbook/reclaim-node'
import { ClaimCreationRequestedEvent } from '@questbook/reclaim-node/lib/types/contracts/Reclaim'
import { createSignDataForClaim, signatures } from '@reclaimprotocol/crypto-sdk'
import { utils } from 'ethers'
import { ServerError, Status } from 'nice-grpc'
import { DEFAULT_MINT_CHAIN_ID } from '../config'
import { RPCPromiseHandler } from '../types'
import { MINT_SIGNER } from '../utils/wallet'

const startClaimCreation: RPCPromiseHandler<'startClaimCreation'> = async(
	{ authorisationSignature, infoHash, expiryTimestampMs, captchaToken },
	{ token }
) => {
	if(captchaToken) {
		// TODO: verify captcha token
	}

	const data = createSignDataForClaim({
		infoHash: utils.hexlify(infoHash).toLowerCase(),
		owner: MINT_SIGNER.address.toLowerCase(),
		claimId: 0,
		timestampS: Math.floor(expiryTimestampMs / 1000)
	})
	const verified = await signatures.verify(
		Buffer.from(data),
		authorisationSignature,
		token.id
	)
	if(!verified) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'Authorisation signature mismatch')
	}

	let contract = getContract(DEFAULT_MINT_CHAIN_ID)
	contract = contract.connect(MINT_SIGNER.connect(contract.provider))

	const mintFees = await contract.createFees()
	const tx = await contract.requestClaimCreateForAnother(
		authorisationSignature,
		infoHash,
		expiryTimestampMs,
		{ value: mintFees }
	)
	const result = await tx.wait()
	const ev = result.events
		?.find(e => e.event === 'ClaimCreationRequested') as ClaimCreationRequestedEvent

	return {
		chainId: DEFAULT_MINT_CHAIN_ID,
		claimId: +ev.args.claimId.toString(),
		witnessHosts: ev.args.witnessHosts,
	}
}

export default startClaimCreation