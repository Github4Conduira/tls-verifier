import { getProviderType } from '@app/lib/utils'
import { ProviderType } from '@app/providers'
import { ClaimStatus, Link } from '@app/redux/links/types'
import { Link as BaseLink } from '@questbook/reclaim-client-sdk'
import { ProviderName } from '@questbook/reclaim-node'

export const transformLink = (link: BaseLink): Link => ({
	...link,
	claims: link.claims.map((claim, index) => ({
		...claim,
		claimProvider: claim.provider as ProviderName,
		provider: getProviderType(claim.provider) as ProviderType,
		internalId: index,
		status: ClaimStatus.UNCLAIMED,
		title: 'untitled',
		ownerPublicKey: Buffer.from(claim.ownerPublicKey).toString('hex'),
	})),
})
