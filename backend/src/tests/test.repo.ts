import { randomBytes, randomUUID } from 'crypto'
import { EncryptedClaimProof, Link, VerificationRequest, VerificationRequestStatus } from '../api'
import { makeRepository } from '../repository'
import { IUser, Repository } from '../types'
import { unixTimestampSeconds } from '../utils/generics'

describe('Repo', () => {

	let repo: Repository

	beforeAll(async() => {
		repo = await makeRepository()
	})

	afterAll(async() => {
		await repo!.close()
	})

	it('should upsert & get user', async() => {
		const user = createRandomUser()
		let usr = await repo.upsertUser(user)
		expect(usr.id).toEqual(user.id)
		usr.firebaseToken = 'token'
		usr = await repo.upsertUser(user)
		expect(usr).toEqual(user)

		usr = await repo.getUser({ id:user.id })
		expect(usr).toEqual(user)
	})

	it('should insert & get links', async() => {
		const user = createRandomUser()
		const usr = await repo.upsertUser(user)

		const claim = {
			id: 1,
			chainId: 1,
			provider: 'google-login',
			redactedParameters: '*****@creatoros.co',
			ownerPublicKey: randomBytes(32),
			timestampS: unixTimestampSeconds(),
			witnessAddresses: ['localhost', 'creatoros.co']
		}

		const link = {
			id:randomUUID(),
			userId: usr.id,
			name: 'test link',
			claims: [claim],
			createdAtS: unixTimestampSeconds(),
			views: 10
		}
		await repo.insertLink(link)

		const links = await repo.getLinks({ userId:usr.id })

		expect(links[0]).toEqual(link)
	})

	it('should insert & get request', async() => {
		const user = createRandomUser()
		const usr = await repo.upsertUser(user)

		const claim = {
			id: 2,
			chainId: 1,
			provider: 'google-login',
			redactedParameters: '*****@creatoros.co',
			ownerPublicKey: randomBytes(32),
			timestampS: unixTimestampSeconds(),
			witnessAddresses: ['localhost', 'creatoros.co']
		}

		const link = {
			id:randomUUID(),
			userId: usr.id,
			name: 'test link',
			claims: [claim],
			createdAtS: unixTimestampSeconds(),
			views: 10
		}
		await repo.insertLink(link)


		const proofs: EncryptedClaimProof[] = [{
			id:1,
			enc:randomBytes(32)
		},
		{
			id:2,
			enc:randomBytes(32)
		}]

		const req = createRandomRequest(user.id, 'want to hire you', link, proofs)
		req.expiresAtS -= 3600

		await repo.insertVerificationRequest(req)

		let dbReq = await repo.getVerificationRequests({ id:req.id })
		expect(dbReq.length).toEqual(1)
		let r = dbReq[0]
		expect(r.encryptedClaimProofs).toEqual(proofs)

		dbReq = await repo.getVerificationRequests({ requestorOrClaimerId:usr.id })
		expect(dbReq.length).toEqual(1)
		r = dbReq[0]
		expect(r.encryptedClaimProofs).toEqual(proofs)

		dbReq = await repo.getVerificationRequests({ expiresAtS:{ lt:unixTimestampSeconds() } })
		r = dbReq.find(r => r.id === req.id)
		expect(r).toBeDefined()

		await repo.updateVerificationRequest(req.id, { status:VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE })
		dbReq = await repo.getVerificationRequests({ id:req.id })
		expect(dbReq.length).toEqual(1)
		expect(dbReq[0].status).toEqual(VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE)
	})

	it('request pagination should work properly', async() => {
		const user = createRandomUser()
		await repo.upsertUser(user)

		for(let i = 0; i < 100; i++) {
			const claim = {
				id: i + 10,
				chainId: 1,
				provider: 'google-login',
				redactedParameters: '*****@creatoros.co',
				ownerPublicKey: randomBytes(32),
				timestampS: unixTimestampSeconds(),
				witnessAddresses: ['localhost', 'creatoros.co']
			}

			const link = {
				id:randomUUID(),
				userId: user.id,
				name: 'test link ' + i,
				claims: [claim],
				createdAtS: unixTimestampSeconds(),
				views: i
			}
			await repo.insertLink(link)

			const proofs: EncryptedClaimProof[] = [
				{
					id: claim.id,
					enc:randomBytes(32)
				},
			]

			const req: VerificationRequest = createRandomRequest(
				user.id,
				'want to hire you ' + i,
				link,
				proofs,
				i
			)

			await repo.insertVerificationRequest(req)
		}

		for(let i = 0; i < 10; i++) {
			const reqs = await repo.getVerificationRequests({
				requestorOrClaimerId:user.id,
				count:10,
				offset:10 * i
			})
			expect(reqs.length).toEqual(10)
			for(let j = 0; j < 10; j++) {
				expect(reqs[j].context).toContain(' ' + (10 * i + j))
			}
		}
	})

	it('link pagination should work properly', async() => {
		const user = createRandomUser()
		await repo.upsertUser(user)

		const LINKS_COUNT = 101

		for(let i = 1; i <= LINKS_COUNT; i++) {
			const claim = {
				id: i,
				chainId: 1,
				provider: 'google-login',
				redactedParameters: '*****@creatoros.co',
				ownerPublicKey: randomBytes(32),
				timestampS: unixTimestampSeconds(),
				witnessAddresses: ['localhost', 'creatoros.co']
			}

			const link = {
				id:randomUUID(),
				userId: user.id,
				name: 'test link ' + i,
				claims: [claim],
				createdAtS: unixTimestampSeconds() + i,
				views: i
			}
			await repo.insertLink(link)
		}

		const foundLinks = new Set<string>()
		let page = 0
		while(foundLinks.size < LINKS_COUNT) {
			const links = await repo.getLinks({
				userId:user.id,
				page: page,
				count:10,
			})

			expect(links.length).toBeLessThanOrEqual(10)

			if(!links.length) {
				break
			}

			for(const link of links) {
				foundLinks.add(link.id)
				expect(link.claims).toHaveLength(1)
			}

			page += 1
		}

		expect(foundLinks.size).toEqual(LINKS_COUNT)
	})
})

function createRandomUser(): IUser {
	return {
		id: randomUUID(),
		createdAtS: unixTimestampSeconds(),
		updatedAtS: unixTimestampSeconds(),
		firebaseToken: null,
	}
}

function createRandomRequest(userId, context: string, link: Link, proofs: EncryptedClaimProof[], i?: number): VerificationRequest {
	return {
		id:randomUUID(),
		createdAtS:unixTimestampSeconds() + i ? i : 0,
		updatedAtS:unixTimestampSeconds() + i ? i : 0,
		link:link,
		communicationPublicKey:randomBytes(32),
		context:context,
		communicationSignature:randomBytes(32),
		encryptedClaimProofs:proofs,
		expiresAtS:unixTimestampSeconds(),
		status:VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING,
		requestorId:userId
	}
}