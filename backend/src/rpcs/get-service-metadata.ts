import { RPCPromiseHandler } from '../types/proto'
import { MINT_SIGNER } from '../utils/wallet'

const getServiceMetadata: RPCPromiseHandler<'getServiceMetadata'> = async() => {
	const walletAddress = MINT_SIGNER.address.toLowerCase()

	return { walletAddress }
}

export default getServiceMetadata