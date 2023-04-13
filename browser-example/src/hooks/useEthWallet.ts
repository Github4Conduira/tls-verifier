import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'

const ethereum = 'ethereum' in window ? (window as any).ethereum : undefined

export function useEthWallet() {
	const [connectedAddress, setConnectedAddress] = useState<string>()

	const provider = useMemo(() => {
		if (!ethereum) return undefined
		return new ethers.providers.Web3Provider(ethereum)
	}, [])

	const connect = useCallback(
		async() => {
			await ethereum.send("eth_requestAccounts")
			await checkConnected()

			return provider?.getSigner()
		},
		[provider]
	)

	useEffect(() => {
		if (!ethereum) {
			return
		}

		ethereum.on('accountsChanged', handle)
		ethereum.on('networkChanged', handleNetworkChange)

		function handle(accounts: string[]) {
			setConnectedAddress(accounts[0])
		}

		function handleNetworkChange() {

		}

		return () => {
			ethereum.removeListener('accountsChanged', handle)
			ethereum.removeListener('networkChanged', handleNetworkChange)
		}
	}, [])

	useEffect(() => {
		checkConnected()
	}, [])

	return {
		hasWalletExtension: !!provider,
		isConnected: !!connectedAddress,
		connectedAddress,
		provider,
		connect,
		async signMessage(msg: string) {
			const signer = provider!.getSigner()
			const signature = await signer.signMessage(msg)
			const address = await signer.getAddress()
			return {
				signature,
				walletAddress: address
			}
		}
	}

	async function checkConnected() {
		try {
			const signer = provider?.getSigner()
			const address = await signer?.getAddress()
			setConnectedAddress(address)
		} catch(error) {
			console.error('error in account fetch: ', error)
			setConnectedAddress(undefined)
		}
	}
}