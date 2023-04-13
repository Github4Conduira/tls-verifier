import { ServerError, Status } from 'nice-grpc'
import { VerificationRequestStatus } from '../api'
import { RPCPromiseHandler } from '../types'
import sendNotification from '../utils/firebase'

const succeedVerificationRequest: RPCPromiseHandler<'succeedVerificationRequest'> = async(
	{ id, },
	{ firebaseApp, token, repository }
) => {
	const [verificationRequest] = await repository.getVerificationRequests({ id })
	if(!verificationRequest) {
		throw new ServerError(Status.NOT_FOUND, `Verification request "${id}" not found`)
	}

	if(verificationRequest.requestorId !== token.id) {
		throw new ServerError(Status.PERMISSION_DENIED, 'Only requestor can mark verification request succeeded')
	}

	if(verificationRequest.status !== VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'Verification request must be pending approval to succeed')
	}

	await repository.updateVerificationRequest(id, {
		status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE,
	})

	const notification = {
		title: 'Verification Request - Status',
		body: `Verification request ${verificationRequest.id} succeeded!`,
		data: { verificationRequestId: verificationRequest.id },
	}

	const config = {
		userId: verificationRequest.link.userId,
		repository,
		firebaseApp
	}

	try {
		await sendNotification(notification, config)
	} catch(e) {
		console.log('Error sending notification', e)
	}


	return { }
}

export default succeedVerificationRequest