import { ServerError, Status } from 'nice-grpc'
import { VerificationRequestStatus } from '../api'
import { RPCPromiseHandler } from '../types'
import sendNotification from '../utils/firebase'

const acceptVerificationRequest: RPCPromiseHandler<'acceptVerificationRequest'> = async(
	{ id, encryptedClaimProofs },
	{ token, repository, firebaseApp }
) => {
	if(!encryptedClaimProofs.length) {
		throw new ServerError(Status.INVALID_ARGUMENT, 'No encrypted claim proofs provided')
	}

	const [verificationRequest] = await repository.getVerificationRequests({ id })
	if(!verificationRequest) {
		throw new ServerError(Status.NOT_FOUND, `Verification request "${id}" not found`)
	}

	if(verificationRequest.link.userId !== token.id) {
		throw new ServerError(Status.PERMISSION_DENIED, 'Only link owner can accept verification request')
	}

	if(verificationRequest.status !== VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'Verification request must be pending to accept')
	}

	await repository.updateVerificationRequest(id, {
		status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL,
		encryptedClaimProofs,
	})

	const notification = {
		title: 'Verification Request - Status',
		body: `Verification request with id ${verificationRequest.id} got accepted!`,
		data: { verificationRequestId: verificationRequest.id },
	}

	const config = {
		userId: verificationRequest.requestorId,
		repository,
		firebaseApp
	}

	try {
		await sendNotification(notification, config)
	} catch(e) {
		console.log('Error sending notification', e)
	}

	return {}
}

export default acceptVerificationRequest