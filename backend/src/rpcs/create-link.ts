import { getContract } from '@questbook/reclaim-node'
import { ServerError, Status } from 'nice-grpc'
import { Link } from '../api'
import { RPCPromiseHandler } from '../types/proto'
import { createLinkId, unixTimestampSeconds } from '../utils/generics'

const createLink: RPCPromiseHandler<'createLink'> = async(
	{ name, claims },
	{ token, repository }
) => {
	if(!claims.length) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'No claims provided')
	}

	await Promise.all(
		claims.map(async claim => {
			const contract = getContract(claim.chainId)
			const witnesses = await contract.getClaimWitnesses(claim.id)

			if(!witnesses.length) {
				throw new ServerError(
					Status.INVALID_ARGUMENT,
					`Claim "${claim.id}" not found on chain ${claim.chainId}`
				)
			}

			claim.witnessAddresses = witnesses
				.map(witness => witness.toLowerCase())
		})
	)

	const link: Link = {
		id: createLinkId(),
		name,
		claims,
		createdAtS: unixTimestampSeconds(),
		views: 0,
		userId: token.id
	}
	await repository.insertLink(link)

	return {
		id: link.id
	}
}

export default createLink