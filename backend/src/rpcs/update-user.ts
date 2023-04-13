import { RPCPromiseHandler } from '../types/proto'
import { unixTimestampSeconds } from '../utils/generics'

const updateUser: RPCPromiseHandler<'updateUser'> = async(
	{ firebaseToken },
	{ token, repository }
) => {

	let user = await repository.getUser({ id: token.id })
	if(!user) {
		user = {
			id: token.id,
			createdAtS: unixTimestampSeconds(),
			updatedAtS: unixTimestampSeconds(),
			firebaseToken: null,
		}
	}

	user.firebaseToken = firebaseToken

	await repository.upsertUser(user)
	return {}
}

export default updateUser