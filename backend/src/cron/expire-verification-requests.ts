import { VerificationRequestStatus } from '../api'
import { DEFAULT_VERIFICATION_REQUEST_LIFETIME_H } from '../config'
import { firebaseApp } from '../firebase'
import { makeRepository } from '../repository'
import sendNotification from '../utils/firebase'
import { unixTimestampSeconds } from '../utils/generics'
import LOGGER from '../utils/logger'

export async function expireVerificationRequests() {
	const logger = LOGGER.child({ stream: 'expirer' })
	logger.info('finding expired verification requests...')

	const repository = await makeRepository()
	const expiryTimestamp = unixTimestampSeconds() - DEFAULT_VERIFICATION_REQUEST_LIFETIME_H * 60 * 60

	const verifications = await repository.getVerificationRequests({
		expiresAtS: {
			lt: expiryTimestamp
		}
	})

	logger.info(`Expiring ${verifications.length} verification requests`)

	for(const verification of verifications) {
		await repository.updateVerificationRequest(verification.id, {
			status: VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_EXPIRED
		})

		const notification = {
			title: 'Verification Request - Status',
			body: `Verification request with id ${verification.id} expired!`,
			data: { verificationRequestId: verification.id },
		}

		const config = {
			userId: verification.requestorId,
			repository,
			firebaseApp
		}

		try {
			// send notifications to both the requestor and claimer
			await sendNotification(notification, config)

			config.userId = verification.link.userId
			await sendNotification(notification, config)
		} catch(e) {
			console.log('Error sending notification', e)
		}

		// TODO: take money from whoever let the request expire

		logger.info({ verification: verification.id }, 'expired')
	}

	logger.info('done expiring verification requests')
}