import { authoriseWalletForClaimCreation, hashClaimInfo } from '@questbook/reclaim-crypto-sdk'
import { expect } from 'chai'
import { utils, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { Reclaim } from '../src/types'
import { ClaimCreationRequestedEvent } from '../src/types/contracts/Reclaim'
import { deployReclaimContract, randomEthAddress, randomWallet } from './utils'

const NUM_ORACLES = 3
const MOCK_HOST_PREFIX = 'localhost:555'

describe('Reclaim Tests', () => {

	let contract: Reclaim

	let witnesses: { wallet: Wallet, host: string }[] = []

	beforeEach(async() => {
		contract = await deployReclaimContract()

		witnesses = []
		for(let i = 0; i < NUM_ORACLES; i++) {
			const witness = await randomWallet()
			const host = MOCK_HOST_PREFIX + i.toString()
			await contract.updateWitnessWhitelist(witness.address, true)
			await contract
				.connect(witness)
				.addAsWitness(witness.address, host)
			witnesses.push({ wallet: witness, host })
		}
	})

	it('should request a claim creation', async() => {
		const user = await randomWallet()
		const fees = await contract.createFees()
		const provider = 'google-login'
		const parameters = '{"email":"1234"}'

		const infoHash = hashClaimInfo({
			provider,
			parameters
		})

		const tx = await contract
			.connect(user)
			.requestClaimCreate(infoHash, {
				value: utils.parseEther('0.1'),
			})
		const receipt = await tx.wait()
		const event = receipt.events
			?.find(e => e.event === 'ClaimCreationRequested') as ClaimCreationRequestedEvent
		expect(event).to.exist
		expect(event?.args?.witnessHosts).to.include(MOCK_HOST_PREFIX + '0')
		expect(event?.args?.owner).to.equal(user.address)
		expect(event?.args?.infoHash).to.equal(infoHash)

		const claimId = event.args.claimId

		const balance = await ethers.provider.getBalance(contract.address)
		expect(balance.gte(fees)).to.be.true

		const witnesses = await contract.getClaimWitnesses(claimId)
		expect(witnesses).to.have.lengthOf(NUM_ORACLES)

		// witness still in place
		// to ensure it wasn't morphed when request a credential
		expect(await contract.witnesses(0)).to.have.property('host', MOCK_HOST_PREFIX + '0')
	})

	it('should mint a credential on another wallet behalf', async() => {
		const user = await randomWallet()
		const requestor = await randomWallet()
		const provider = 'google-login'
		const parameters = '{"email":"1234"}'

		const infoHash = hashClaimInfo({ provider, parameters })
		const { signature: authSign, expiryMs } = await authoriseWalletForClaimCreation(
			user,
			requestor.address,
			{ infoHash }
		)

		const txReq = await contract
			.connect(requestor)
			.requestClaimCreateForAnother(
				authSign,
				infoHash,
				expiryMs,
				{ value: utils.parseEther('0.1') }
			)
		const reqResult = await txReq.wait()
		const reqEvent = reqResult.events
			?.find(e => e.event === 'ClaimCreationRequested') as ClaimCreationRequestedEvent
		const witnessesAssigned: string[] = reqEvent?.args?.witnessHosts
		expect(witnessesAssigned).to.exist
		expect(reqEvent?.args?.owner).to.equal(user.address)
		expect(reqEvent?.args?.infoHash).to.equal(infoHash)
		expect(reqEvent.args?.requestor).to.equal(requestor.address)
	})

	it('should fail to execute admin functions if not owner', async() => {
		const NOT_OWNER_MSG = 'Ownable: caller is not the owner'
		const user = await randomWallet()
		contract = await contract.connect(user)

		const expectedRejections = [
			() => contract.updateCreationFees(utils.parseEther('0.1')),
			() => contract.updateWitnessWhitelist(randomEthAddress(), true),
			() => contract.updateSmartContractFeesKeepPercentage(10),
			() => contract.transfer(user.address, 5000)
		]

		for(const reject of expectedRejections) {
			await expect(reject()).to.be.revertedWith(NOT_OWNER_MSG)
		}
	})
})
