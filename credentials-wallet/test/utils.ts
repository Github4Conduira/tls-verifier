// eslint-disable-next-line simple-import-sort/imports
import '../hardhat.config'
import { randomBytes } from 'crypto'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

export function randomEthAddress() {
	const addr = randomBytes(20) // random address
	return `0x${addr.toString('hex')}`
}

export async function randomWallet(balanceEth: BigNumber | number = 1) {
	const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
	if(balanceEth > 0) {
		// fund the wallet so it can make transactions
		let wei = typeof balanceEth === 'number'
			? '0x' + Number(balanceEth * 1e18).toString(16)
			: balanceEth.toHexString()
		wei = wei.replace('0x0', '0x')
		await ethers.provider.send('hardhat_setBalance', [wallet.address, wei])
	}

	return wallet
}

// copied from library
export type CompleteApplicationData = {
	application: string
	jsonParams: string
	identity: string
	timestampS: number
	requestId: number
}

export function stringifyProviderClaimData(data: CompleteApplicationData) {
	return [
		data.application,
		data.jsonParams,
		data.identity,
		data.timestampS.toString(),
		data.requestId.toString()
	].join('\n')
}