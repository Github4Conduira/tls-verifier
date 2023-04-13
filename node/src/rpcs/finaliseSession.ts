import providers from '../providers'
import { assertSession } from '../sessions/assert-session'
import { generateSessionReceipt } from '../sessions/generate-session-receipt'
import { RPCPromiseHandler } from '../types'
import { ServerError, signProviderClaimData, Status } from '../utils/generics'

const finaliseSession: RPCPromiseHandler<'finaliseSession'> = async(
	{ sessionId, revealBlocks, cipherSuite },
	{ logger },
) => {
	const session = assertSession(sessionId)
	const claimData = session.attachedData.claim
	session.socket.end()

	for(const {
		authTag,
		directReveal,
		zkReveal,
		key,
		iv
	} of revealBlocks) {
		const authTagBuffer = Buffer.from(authTag)
		const msg = session.transcript.find(t => (
			authTagBuffer.equals(t.packet!.authenticationTag)
		))
		if(!msg) {
			throw new ServerError(
				Status.INVALID_ARGUMENT,
				`No matching message found for '${authTagBuffer.toString('hex')}'`
			)
		}

		if(directReveal?.key.length) {
			msg.directReveal = directReveal
		} else if(zkReveal?.proofs.length) {
			msg.zkReveal = zkReveal
		} else if(key.length && iv.length) {
			msg.directReveal = {
				key,
				iv
			}
		}
	}

	// generate the signed receipt
	const receipt = await generateSessionReceipt(session, cipherSuite, logger)
	// verify provider claim, if any
	let signature: Uint8Array | undefined
	if(claimData) {
		const provider = providers[claimData.provider as keyof typeof providers]

		try {
			await provider.assertValidProviderReceipt(receipt, JSON.parse(claimData.parameters))
		} catch(error) {
			logger.error(
				{ trace: error.stack },
				'receipt generation failed'
			)
			throw new ServerError(Status.PERMISSION_DENIED, error.message)
		}

		signature = await signProviderClaimData(claimData)
	}

	return {
		receipt,
		claimData,
		signature,
	}
}

export default finaliseSession
