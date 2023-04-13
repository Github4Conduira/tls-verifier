import { createSignDataForCommunicationKey, signatures } from '@questbookapp/reclaim-crypto-sdk'
import { ServerError, Status } from 'nice-grpc'
import { VerificationRequest, VerificationRequestStatus } from '../api'
import { DEFAULT_VERIFICATION_REQUEST_LIFETIME_H } from '../config'
import { RPCPromiseHandler } from '../types'
import sendNotification from '../utils/firebase'
import { createVerificationRequestId, unixTimestampSeconds } from '../utils/generics'

const createVerificationRequest: RPCPromiseHandler<'createVerificationRequest'> = async(
	{ linkId, communicationPublicKey, communicationSignature, context },
	{ firebaseApp, token, repository }
) => {
	if(
		!linkId
	) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'Invalid arguments')
	}

	// pub keys are 33 bytes
	if(communicationPublicKey?.length !== 33) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'Invalid communication public key')
	}

	const signData = createSignDataForCommunicationKey(
		{ communicationPublicKey, linkId, context }
	)
	const verified = await signatures.verify(
		signData,
		communicationSignature,
		token.id
	)

	if(!verified) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'Invalid communication signature')
	}

	const [link] = await repository.getLinks({ id: linkId })
	if(!link) {
		throw new ServerError(Status.NOT_FOUND, `Link "${linkId}" not found`)
	}

	const request: VerificationRequest = {
		id: createVerificationRequestId(),
		link,
		context,
		status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING,
		communicationPublicKey,
		communicationSignature,
		requestorId: token.id,
		createdAtS: unixTimestampSeconds(),
		updatedAtS: unixTimestampSeconds(),
		expiresAtS: unixTimestampSeconds() + DEFAULT_VERIFICATION_REQUEST_LIFETIME_H * 60 * 60,
		encryptedClaimProofs: []
	}

	await repository.insertVerificationRequest(request)

	const notification = {
		title: 'Verification Request - New',
		body: `User ${request.requestorId} wants to verify your link ${link.id} with verification request ${request.id}!`,
		data: {
			verificationRequestId: request.id,
			linkId: link.id,
			requestorId: request.requestorId,
			context
		},
	}

	const config = {
		userId: link.userId,
		repository,
		firebaseApp
	}

	try {
		await sendNotification(notification, config)
	} catch(e) {
		console.log('Error sending notification', e)
	}

	return { id: request.id }
}

export default createVerificationRequest