import { makeGrpcServer } from './server/make-grpc-server'
import loadEnv from './utils/env'
import logger from './utils/logger'
import { MINT_SIGNER } from './utils/wallet'
import { startCronJobs } from './cron'

loadEnv()

async function main() {
	const srv = await makeGrpcServer()
	const cron = startCronJobs()

	logger.info({ wallet: MINT_SIGNER.address }, 'using wallet')

	process.on('SIGINT', async() => {
		await srv.close()
		await cron.close()
	})
}

main()