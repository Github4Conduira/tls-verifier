import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { ethers } from 'ethers'
import WEB2WALLET_ABI from '../abi/web2wallet.json'
import { CredentialsWallet } from '../types'

export default class CredentialsWalletSigner extends Signer {

	wallet: CredentialsWallet
	ogSigner: Signer

	constructor(webwalletAddress: string, signer: Signer) {
		super()

		this.ogSigner = signer
		this.wallet = this._attachToCredentialsWallet(webwalletAddress, signer)
	}

	connect(provider: Provider) {
		return new CredentialsWalletSigner(
			this.wallet.address,
			this.ogSigner.connect(provider)
		)
	}

	async getAddress() {
		return this.wallet.address
	}

	async signMessage(): Promise<string> {
		throw new Error('Method not implemented.')
	}

	async signTransaction(): Promise<string> {
		throw new Error('Method not implemented.')
	}

	async sendTransaction(transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>) {
		const tx = await this.wallet.invoke(
			(await transaction.to)!,
			(await transaction.data)!,
			{ value: (await transaction.value), }
		)
		return tx
	}

	private _attachToCredentialsWallet(address: string, signer: Signer) {
		const contract = new ethers.Contract(
			address,
			WEB2WALLET_ABI,
			signer
		)
		return contract as CredentialsWallet
	}
}