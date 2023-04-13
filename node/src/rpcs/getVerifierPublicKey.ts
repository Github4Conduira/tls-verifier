import { PRIVATE_KEY } from '../config'
import { SelectedServiceSignature, SelectedServiceSignatureType } from '../signatures'
import { RPCPromiseHandler } from '../types'

const getVerifierPublicKey: RPCPromiseHandler<'getVerifierPublicKey'> = async(
	{ },
	{ },
) => {
	return {
		publicKey: await SelectedServiceSignature.getPublicKey(PRIVATE_KEY),
		signatureType: SelectedServiceSignatureType,
	}
}

export default getVerifierPublicKey
