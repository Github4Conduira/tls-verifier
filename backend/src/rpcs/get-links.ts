import { Link } from '../api'
import { RPCPromiseHandler } from '../types/proto'

const getLinks: RPCPromiseHandler<'getLinks'> = async(
	{ id, view },
	{ token, repository }
) => {
	let resLinks: Link[] = []

	// case 1: only requesting one link
	if(id) {
		resLinks = await repository.getLinks({ id })

		// Check if link with the given id exists
		if(resLinks?.length) {
			const dbLink = resLinks[0]

			// increment view count
			if(view) {
				await repository.updateLink(dbLink.id, { views: dbLink.views + 1 })
			}

			resLinks = [dbLink]
		}
	} else { // case 2: requesting all the links that belong to a user
		resLinks = await repository.getLinks({ userId: token.id })
	}

	return {
		links: resLinks
	}
}

export default getLinks