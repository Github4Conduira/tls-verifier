import { DBClaim } from './claim'
import { DBLink } from './link'
import { DBEncryptedClaimProof } from './proof'
import { DBUser } from './user'
import { DBVerificationRequest } from './verification-request'

export const entities = [
	DBClaim,
	DBLink,
	DBEncryptedClaimProof,
	DBUser,
	DBVerificationRequest,
]