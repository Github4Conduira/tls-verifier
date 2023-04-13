import { ReclaimBackendServiceImplementation } from '../api'
import acceptVerificationRequest from './accept-verification-request'
import createLink from './create-link'
import createVerificationRequest from './create-verification-request'
import failVerificationRequest from './fail-verification-request'
import getLinks from './get-links'
import getServiceMetadata from './get-service-metadata'
import getVerificationRequests from './get-verification-requests'
import rejectVerificationRequest from './reject-verification-request'
import startClaimCreation from './start-claim-creation'
import succeedVerificationRequest from './succeed-verification-request'
import updateUser from './update-user'

const rpcs: ReclaimBackendServiceImplementation = {
	getLinks,
	createLink,
	createVerificationRequest,
	acceptVerificationRequest,
	rejectVerificationRequest,
	succeedVerificationRequest,
	failVerificationRequest,
	getVerificationRequests,
	updateUser,
	startClaimCreation,
	getServiceMetadata
}

export default rpcs