import { RPCPromiseHandler } from '../types'

const getVerificationRequests: RPCPromiseHandler<'getVerificationRequests'> = async(
	{ id, pagination },
	{ token, repository }
) => {
	const page = (pagination?.page || 1)
	const pageSize = (pagination?.pageSize || 10)
	const requests = await repository.getVerificationRequests({
		id:id,
		requestorOrClaimerId: token.id,
		offset: (page - 1) * pageSize,
		count: pageSize,
	})
	const nextPage = requests.length >= pageSize ? page + 1 : 0

	return {
		requests,
		nextPage
	}
}

export default getVerificationRequests