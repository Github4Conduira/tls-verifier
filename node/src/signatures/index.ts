import { signatures } from '@reclaimprotocol/crypto-sdk'
import { ServiceSignatureType } from '../proto/api'

export const SIGNATURES = {
	[ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH]: signatures,
}

export const SelectedServiceSignatureType = ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH

export const SelectedServiceSignature = SIGNATURES[SelectedServiceSignatureType]