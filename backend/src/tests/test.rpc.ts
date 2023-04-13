import {
	authoriseWalletForClaimCreation,
	createSignDataForCommunicationKey,
	generateAuthToken, hashClaimInfo,
	signatures
} from '@questbookapp/reclaim-crypto-sdk'
import { randomBytes, randomInt } from 'crypto'
import { utils, Wallet } from 'ethers'
import { arrayify } from 'ethers/lib/utils'
import { Client, createChannel, createClient, Metadata } from 'nice-grpc'
import { CreateVerificationRequestResponse, EncryptedClaimProof, LinkClaim, ReclaimBackendDefinition } from '../api'
import { makeRepository } from '../repository'
import { makeGrpcServer } from '../server/make-grpc-server'
import { unixTimestampSeconds } from '../utils/generics'

jest.setTimeout(15_000)
jest.mock('firebase-admin')
jest.mock('../utils/firebase', () => ({
	...jest.requireActual('../utils/firebase'),
	__esModule: true,
	default: jest.fn(),
}))

jest.mock('@questbook/reclaim-node', () => ({
	...jest.requireActual('@questbook/reclaim-node'),
	__esModule: true,
	getContract: jest.fn(() => {
		return {
			connect: jest.fn(() => {
				return {
					createFees: jest.fn(),
					requestClaimCreateForAnother: jest.fn(() => {
						return {
							wait: jest.fn(() => {
								const event = {
									event:'ClaimCreationRequested',
									args:{
										claimId:1,
										witnessHosts:['localhost']
									}
								}
								return {
									events:[event]
								}
							})
						}
					})
				}
			}),
			getClaimWitnesses: jest.fn(() => {
				return [Wallet.createRandom().address]
			})
		}
	}),

}))


describe('RPC Tests', () => {
	const grpcServerPort = Math.floor(Math.random() * 10000 + 10000)
	let server: { close: () => Promise<void> }
	const channel = createChannel(`localhost:${grpcServerPort}`)
	let client: Client<ReclaimBackendDefinition>
	const user = Wallet.createRandom()

	beforeAll(async() => {
		server = await makeGrpcServer(grpcServerPort)
		client = await makeGrpcClient(user.privateKey)
	})

	afterAll(async() => {
		channel.close()
		await server.close()
	})

	it('should fetch service metadata', async() => {
		const resp = await client.getServiceMetadata({})
		expect(resp.walletAddress).toBeTruthy()
	})

	it('should update user', async() => {
		const resp = await client.updateUser({ firebaseToken: '123' })
		expect(resp).not.toBeUndefined()

		const repo = await makeRepository()
		const usr = await repo.getUser({ id: user.address.toLowerCase() })
		expect(usr.firebaseToken).toEqual('123')
	})

	it('should create & return link', async() => {
		const usr = await client.updateUser({ firebaseToken:'123' })
		expect(usr).not.toBeUndefined()

		const claim = await getRandomClaim(user.privateKey)

		const resp = await client.createLink({ name: 'test', claims: [claim] })
		expect(resp.id).not.toBeUndefined()

		let linksResp = await client.getLinks({})
		let links = linksResp.links
		expect(links.length).toEqual(1)
		expect(links[0].claims[0].id).toEqual(claim.id)

		linksResp = await client.getLinks({ id: resp.id })
		links = linksResp.links
		expect(links.length).toEqual(1)
		expect(links[0].claims[0].id).toEqual(claim.id)
	})

	it('should create verification request', async() => {
		const req = await createReq()
		expect(req.id).not.toBeUndefined()
	})

	it('should accept verification request', async() => {

		const req = await createReq()
		const repo = await makeRepository()
		const dbReq = await repo.getVerificationRequests({ id: req.id })

		const proof: EncryptedClaimProof = {
			id: dbReq[0].link.claims[0].id,
			enc: randomBytes(32)
		}

		const resp = await client.acceptVerificationRequest({
			id: req.id,
			encryptedClaimProofs: [proof]

		})
		expect(resp).not.toBeUndefined()
	})


	it('should succeed verification request', async() => {
		const req = await createReq()
		const repo = await makeRepository()
		const dbReq = await repo.getVerificationRequests({ id: req.id })

		const proof: EncryptedClaimProof = {
			id: dbReq[0].link.claims[0].id,
			enc: randomBytes(32)
		}

		let resp = await client.acceptVerificationRequest({
			id: req.id,
			encryptedClaimProofs: [proof]
		})
		expect(resp).not.toBeUndefined()
		resp = await client.succeedVerificationRequest({
			id: req.id,
		})
		expect(resp).not.toBeUndefined()
	})

	it('should reject verification request', async() => {
		const req = await createReq()

		const resp = await client.rejectVerificationRequest({
			id: req.id,

		})
		expect(resp).not.toBeUndefined()
	})

	it('should fail verification request', async() => {
		await client.updateUser({ firebaseToken:'123' })
		const req = await createReq()

		//const repo = await makeRepository()
		const reqs = await client.getVerificationRequests({ id:req.id })

		const myReq = reqs.requests[0]

		const proof1: EncryptedClaimProof = {
			id:myReq.link.claims[0].id,
			enc:randomBytes(32)
		}
		const proof2: EncryptedClaimProof = {
			id:myReq.link.claims[1].id,
			enc:randomBytes(32)
		}
		const proof3: EncryptedClaimProof = {
			id:myReq.link.claims[2].id,
			enc:randomBytes(32)
		}
		const proof4: EncryptedClaimProof = {
			id:myReq.link.claims[2].id,
			enc:randomBytes(32)
		}
		const proof5: EncryptedClaimProof = {
			id:myReq.link.claims[2].id,
			enc:randomBytes(32)
		}
		const proof6: EncryptedClaimProof = {
			id:myReq.link.claims[0].id,
			enc:randomBytes(32)
		}

		let resp = await client.acceptVerificationRequest({
			id: req.id,
			encryptedClaimProofs: [proof1, proof2, proof3, proof4, proof5, proof6]
		})
		expect(resp).not.toBeUndefined()
		resp = await client.failVerificationRequest({
			id: req.id,
			communicationPrivateKey: utils.arrayify(user.privateKey)
		})
		expect(resp).not.toBeUndefined()
	})

	it('should start mint', async() => {

		const me = Wallet.createRandom()

		const hash = hashClaimInfo({
			context:'want to hire you',
			provider:'github',
			parameters:'*****@github.com'
		})

		const cli = await makeGrpcClient(me.privateKey)

		const meta = await cli.getServiceMetadata({})

		const { signature, expiryMs } = await authoriseWalletForClaimCreation(me, meta.walletAddress, { infoHash:hash })

		const resp = await cli.startClaimCreation({
			infoHash:arrayify(hash),
			authorisationSignature:signature,
			expiryTimestampMs:expiryMs
		})
		expect(resp).not.toBeUndefined()
	})

	it('should fail to start mint with incorrect address', async() => {

		const me = Wallet.createRandom()

		const hash = hashClaimInfo({
			context:'1',
			provider:'2',
			parameters:'3'
		})

		const cli = await makeGrpcClient(me.privateKey)

		const { signature, expiryMs } = await authoriseWalletForClaimCreation(me, me.address, { infoHash:hash })

		await expect(async() => {
			await cli.startClaimCreation({
				infoHash:arrayify(hash),
				authorisationSignature:signature,
				expiryTimestampMs:expiryMs
			})
		}).rejects.toThrow('Authorisation signature mismatch')
	})

	async function makeGrpcClient(privateKey: string) {
		const metadata = new Metadata()
		const token = await generateAuthToken(privateKey)
		metadata.set('Authorization', token)
		return createClient(
			ReclaimBackendDefinition,
			channel,
			{ '*': { metadata } }
		)
	}

	async function createReq(): Promise<CreateVerificationRequestResponse> {
		const claim1 = await getRandomClaim(user.privateKey)
		const claim2 = await getRandomClaim(user.privateKey)
		const claim3 = await getRandomClaim(user.privateKey)

		const link = await client.createLink({ name: 'test', claims: [claim1, claim2, claim3] })
		expect(link.id).not.toBeUndefined()
		const context = 'want to hire you'
		const data = createSignDataForCommunicationKey({
			communicationPublicKey: await extractPublicKey(user.privateKey),
			linkId: link.id,
			context: context
		})
		const signature = await signatures.sign(data, user.privateKey)
		return await client.createVerificationRequest({
			context: context,
			linkId: link.id,
			communicationPublicKey: await extractPublicKey(user.privateKey),
			communicationSignature: signature
		})
	}
})

async function extractPublicKey(priv: string): Promise<Uint8Array> {
	return signatures.getPublicKey(priv)
}

async function getRandomClaim(priv: string): Promise<LinkClaim> {
	return {
		id: randomInt(10000, 20000),
		chainId: 1,
		provider: 'google-login',
		'timestampS': unixTimestampSeconds(),
		ownerPublicKey: await extractPublicKey(priv),
		redactedParameters: '*****@gmail.com',
		witnessAddresses: ['localhost:1234']
	}
}
