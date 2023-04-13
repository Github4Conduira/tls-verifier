
import { ServerError, Status } from 'nice-grpc'
import { VerificationRequestStatus } from '../api'
import { RPCPromiseHandler } from '../types'
import sendNotification from '../utils/firebase'

const rejectVerificationRequest: RPCPromiseHandler<'rejectVerificationRequest'> = async(
	{ id },
	{ firebaseApp, token, repository }
) => {
	const [verificationRequest] = await repository.getVerificationRequests({ id })
	if(!verificationRequest) {
		throw new ServerError(Status.NOT_FOUND, `Verification request "${id}" not found`)
	}

	if(verificationRequest.link.userId !== token.id) {
		throw new ServerError(Status.PERMISSION_DENIED, 'Only link owner can reject verification request')
	}

	if(verificationRequest.status !== VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'Verification request must be pending to accept')
	}

	await repository.updateVerificationRequest(id, {
		status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED,
	})

	const notification = {
		title: 'Verification Request - Status',
		body: `Verification request ${verificationRequest.id} rejected!`,
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

export default rejectVerificationRequest