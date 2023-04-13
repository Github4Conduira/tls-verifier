import logger from '../utils/logger'
import { expireVerificationRequests } from './expire-verification-requests'

const CRONS = [
	{
		job: expireVerificationRequests,
		interval: 1000 * 60 * 60 * 24 // 1 day
	}
]

export function startCronJobs() {
	const intervals = CRONS.map(({ job, interval }) => {
		return setInterval(job, interval)
	})

	logger.info('started cron jobs')

	return {
		close() {
			intervals.forEach(clearInterval)
		}
	}
}