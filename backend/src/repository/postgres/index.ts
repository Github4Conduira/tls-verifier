import { Brackets, DataSource, LessThan } from 'typeorm'
import { Link, VerificationRequest } from '../../api'
import { IUser, Repository } from '../../types'
import logger from '../../utils/logger'
import { DBLink } from './entities/link'
import { DBUser } from './entities/user'
import { DBVerificationRequest } from './entities/verification-request'
import { AppDataSource } from './data-source'

let source: Promise<DataSource>

export async function makeRepository(): Promise<Repository> {
	const db = await getConnection()

	const linkRepository = db.getRepository(DBLink)
	const verificationsRepository = db.getRepository(DBVerificationRequest)
	const userRepository = db.getRepository(DBUser)

	return {
		async getLinks(
			{
				id,
				userId,
				page,
				count,
			}
		) {
			const query = linkRepository.createQueryBuilder('links')
			if(id) {
				query.andWhere({ id: id })
			}

			if(userId) {
				query.andWhere({ userId: userId })
			}

			return await query
				.leftJoinAndSelect('links.claims', 'claims')
				.orderBy('links.createdAtS', 'ASC')
				.skip((page && count) ? page * count : undefined)
				.take(count)
				.getMany()

		},
		async insertLink(link): Promise<void> {
			await linkRepository.save(link)
		},
		async insertVerificationRequest(req): Promise<void> {
			// save is used to save proofs also
			await verificationsRepository.save(req)
		},
		async updateVerificationRequest(id: string, update: Partial<VerificationRequest>): Promise<void> {
			update.id = id
			await verificationsRepository.save(update)
		},
		async getVerificationRequests(params): Promise<VerificationRequest[]> {

			const query = verificationsRepository.createQueryBuilder('reqs')
				.leftJoinAndSelect('reqs.encryptedClaimProofs', 'encryptedClaimProofs')
				.innerJoinAndSelect('reqs.link', 'link')
				.leftJoinAndSelect('link.claims', 'claims')

			if(params.id) {
				query.andWhere({ id:params.id })
			}

			if(params.requestorOrClaimerId) {
				query.andWhere(new Brackets(qb => qb.where({ requestorId:params.requestorOrClaimerId }).
					orWhere('link.userId = :userId', { userId:params.requestorOrClaimerId })))
			}

			if(params.expiresAtS?.lt) {
				query.andWhere({ expiresAtS: LessThan(params.expiresAtS.lt) })
			}

			return await query
				.orderBy('reqs.createdAtS', 'ASC')
				.skip(params.offset)
				.take(params.count)
				.getMany()
		},
		async updateLink(id: string, update: Partial<Link>): Promise<void> {
			update.id = id
			await linkRepository.save(update)
		},
		async getUser(opts): Promise<IUser> {
			return await userRepository.findOneBy(opts)
		},
		async upsertUser(user: IUser): Promise<IUser> {
			return await userRepository.save(user)
		},
		async close() {
			await db.destroy()
		}
	}
}

/**
 * Creates a database connection if one doesn't exist,
 * otherwise returns the existing connection.
 */
async function getConnection() {
	if(!source) {
		// this is a promise to avoid
		// async race conditions
		source = (async() => {
			if(!AppDataSource.isInitialized) {
				// set migrations to empty array to avoid
				// import errors when running the compiled JS
				AppDataSource.setOptions({ migrations: [] })
				await AppDataSource.initialize()
				logger.info('connected to DB')
			}

			return AppDataSource
		})()
	}

	return source
}