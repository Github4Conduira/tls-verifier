import { Link } from '@app/redux/links/types'
import { BaseTemplate, BaseTemplateClaim, TemplateClaim } from '@app/redux/templates/types'

export const isBaseTemplateClaim = (obj: unknown): obj is BaseTemplateClaim => {
	return (
		(obj as BaseTemplateClaim).provider !== undefined &&
    (obj as BaseTemplateClaim).params !== undefined
	)
}

export const isTemplateClaim = (obj: unknown): obj is TemplateClaim => {
	return !isBaseTemplateClaim(obj) && (obj as TemplateClaim).id !== undefined
}

export const isBaseTemplate = (obj: unknown): obj is BaseTemplate => {
	return (
		(obj as BaseTemplate).id !== undefined &&
    (obj as BaseTemplate).name !== undefined &&
    (obj as BaseTemplate).publicKey !== undefined &&
    (obj as BaseTemplate).claims !== undefined &&
    (obj as BaseTemplate).claims.every(isBaseTemplateClaim) &&
    (obj as BaseTemplate).callbackUrl !== undefined
	)
}

export const makePayload = (link: Link) => {
	return {
		claims: link.claims.map((claim) => {
			if(!claim.params) {
				return
			}

			const key = Object.keys(claim.params)[0]
			const parameters = {
				[key]: claim.params[key].toString(),
			}
			return {
				id: claim.id.toString(),
				provider: claim.claimProvider,
				parameters,
				ownerPublicKey: claim.ownerPublicKey,
				timestampS: claim.timestampS.toString(),
				witnessAddresses: claim.witnessAddresses,
				signatures: claim.signatures,
			}
		}),
	}
}
