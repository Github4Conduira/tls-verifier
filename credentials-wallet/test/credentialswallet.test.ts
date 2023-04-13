import { Reclaim } from '@questbook/reclaim-contracts'
import { expect } from 'chai'
import { utils, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { CredentialsWallet, CredentialsWalletStore } from '../src/types'
import CredentialsWalletSigner from '../src/utils/signer'
import { randomWallet, stringifyProviderClaimData } from './utils'

const APPLICATION = 'google-login'
const JSON_PARAMS = '{"email":"abcd@creatoros.co"}'

describe('Credentials Wallet Tests', () => {

	let credContract: Reclaim
	let store: CredentialsWalletStore
	let contract: CredentialsWallet

	let oracles: { wallet: Wallet, host: string }[] = []

	beforeEach(async() => {
		const credFactory = await ethers.getContractFactory('Reclaim')
		const storeFactory = await ethers.getContractFactory('CredentialsWalletStore')
		const factory = await ethers.getContractFactory('CredentialsWallet')

		credContract = await credFactory.deploy()
		store = await storeFactory.deploy(credContract.address)

		const tx = await store.deployCredentialsWallet(
			APPLICATION,
			JSON_PARAMS
		)
		const receipt = await tx.wait()
		const event = receipt.events?.find(
			(e) => e.event === 'DeployedCredentialsWallet'
		)
		const address = event?.args?.web2WalletAddress

		contract = await factory.attach(address!)

		oracles = []
		const oracle = await randomWallet()
		const host = 'localhost:5555'
		await credContract.updateOracleWhitelist(oracle.address, true)
		await credContract
			.connect(oracle)
			.addAsOracle(host)
		oracles.push({ wallet: oracle, host })
	})

	it('should return the address of the deployed web wallet', async() => {
		const address = await store.getCredentialsWalletAddress(APPLICATION, JSON_PARAMS)
		expect(address).to.eq(contract.address)
	})

	it('should fail to create a new web wallet for the same params', async() => {
		await expect(
			store.deployCredentialsWallet(
				APPLICATION,
				JSON_PARAMS
			)
		).to.be.revertedWith('CredentialsWalletStore: Wallet already deployed')
	})

	it('should login to the credentials wallet', async() => {
		const { user } = await loginToWallet()
		const authorisedSigner = await contract.authorisedSigners(0)
		expect(
			authorisedSigner.toLowerCase()
		).to.eq(user.address.toLowerCase())
	})

	it('should make a tx with the credentials wallet', async() => {
		const { user } = await loginToWallet()
		const web2WalletSigner = new CredentialsWalletSigner(
			contract.address,
			user
		)

		// make request with cred contract
		// to mint a credential
		// and check the web2wallet made it
		await credContract
			.connect(web2WalletSigner)
			.requestCredentialMint(APPLICATION, JSON_PARAMS, {
				value: await credContract.mintFees()
			})
		const result = await credContract.pendingCredentialMints(2)
		expect(result.request.identity).to.eq(contract.address)
	})

	async function loginToWallet() {
		const minFees = await credContract.mintFees()
		const user = await randomWallet(utils.parseEther('1'))
		const timestampS = Math.floor(Date.now() / 1000)
		const requestId = 1

		await contract
			.connect(user)
			.startLoginRequest({ value: minFees })

		const signedCredentials = await Promise.all(
			oracles.map(async(oracle) => {
				const signature = await oracle.wallet.signMessage(
					stringifyProviderClaimData({
						application: APPLICATION,
						jsonParams: JSON_PARAMS,
						requestId,
						timestampS,
						identity: contract.address.toLowerCase(),
					})
				)
				return {
					timestampS,
					signature,
				}
			})
		)

		await contract
			.connect(user)
			.completeLoginRequest(signedCredentials)

		return {
			user
		}
	}
})
