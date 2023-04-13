import { signatures, verifyEncryptedClaims } from '@questbookapp/reclaim-crypto-sdk'
import { utils } from 'ethers'
import { ServerError, Status } from 'nice-grpc'
import { VerificationRequestStatus } from '../api'
import { RPCPromiseHandler } from '../types'
import sendNotification from '../utils/firebase'

const failVerificationRequest: RPCPromiseHandler<'failVerificationRequest'> = async(
	{ id, communicationPrivateKey },
	{ firebaseApp, token, repository, logger }
) => {
	const [verificationRequest] = await repository.getVerificationRequests({ id })
	if(!verificationRequest) {
		throw new ServerError(Status.NOT_FOUND, `Verification request "${id}" not found`)
	}

	if(verificationRequest.requestorId !== token.id) {
		throw new ServerError(Status.PERMISSION_DENIED, 'Only requestor can fail verification request')
	}

	if(verificationRequest.status !== VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'Verification request must be pending approval to succeed')
	}

	// check the private key provided matches the public key in the verification request
	const privateStr = utils.hexlify(communicationPrivateKey)
	const publicKey = await signatures.getPublicKey(privateStr)
	if(Buffer.from(publicKey).compare(verificationRequest.communicationPublicKey) !== 0) {
		throw new ServerError(Status.PERMISSION_DENIED, 'Invalid communication private key provided')
	}

	let error: Error | undefined
	try {
		verifyEncryptedClaims(
			verificationRequest.link.claims,
			verificationRequest.encryptedClaimProofs,
			communicationPrivateKey
		)
	} catch(err) {
		error = err
	}

	if(!error) {
		throw new ServerError(Status.FAILED_PRECONDITION, 'Verification request did not fail')
	}

	logger.info(
		{ msg: error.message, id: verificationRequest.id },
		'verification request failed'
	)

	await repository.updateVerificationRequest(id, {
		status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_FAILED,
	})

	const notification = {
		title: 'Verification Request - Status',
		body: `Verification request ${verificationRequest.id} failed!`,
		data: { verificationRequestId: verificationRequest.id },
	}

	const config = {
		userId: verificationRequest.link.userId,
		repository,
		firebaseApp
	}

	// TODO: select between android and ios firebase apps
	try {
		await sendNotification(notification, config)
	} catch(e) {
		console.log('Error sending notification', e)
	}

	return { }
}

export default failVerificationRequest