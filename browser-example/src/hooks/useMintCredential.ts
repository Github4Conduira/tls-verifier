import { ApplicationName, makeSmartContractMintRequest, mintCredential, MintCredentialOptions, MintStep as ResumableMintStep } from "@questbook/reclaim-node";
import { useCallback, useState } from "react";
import { useEthWallet } from "./useEthWallet";

type MintStep = ResumableMintStep
	| { name: 'idle' }
	| { name: 'connecting' }
	| { name: 'requesting-mint' }
	| { 
		name: 'error'
		error: Error
	}
	| {
		name: 'minted'
	} & Awaited<ReturnType<typeof mintCredential>>

export function useMintCredential() {
	const { provider, isConnected, connect } = useEthWallet()
	const [step, setStep] = useState<MintStep>({ name: 'idle' })
	const [resumableMintStep, setResumableMintStep] = useState<ResumableMintStep>()

	const executeMintCredential = useCallback(
		async function<T extends ApplicationName>(
			opts: Omit<
				MintCredentialOptions<T>,
				'didUpdateMintStep' | 'requestMint'
			>
		) {
			try {
				let signer = provider?.getSigner()
				if(!signer || !isConnected) {
					setStep({ name: 'connecting' })
					signer = await connect()
				}

				if(!signer) {
					throw new Error('Failed to connect to Metamask')
				}

				setStep({ name: 'requesting-mint' })

				const chainId = signer.provider.network.chainId
				const requestMint = makeSmartContractMintRequest({
					chainId,
					signer,
				})
				const data = await mintCredential({
					...opts,
					requestMint,
					resumeFromStep: resumableMintStep,
					didUpdateMintStep(step) {
						setStep(step)
						setResumableMintStep(step)
					}
				})
				setStep({
					name: 'minted',
					...data
				})
				return data
			} catch(error) {
				console.error(`Failed to mint credential`, error)
				setStep({ name: 'error', error })
			}
		},
		[provider, isConnected, resumableMintStep, connect]
	)

	return {
		step,
		provider,
		resumableMintStep,
		reset() {
			setResumableMintStep(undefined)
		},
		executeMintCredential
	}
}