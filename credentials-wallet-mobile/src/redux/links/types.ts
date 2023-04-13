import { ProviderType } from '@app/providers'
import { Template } from '@app/redux/templates/types'
import { Link as BaseLink, LinkClaim as BaseClaim } from '@questbook/reclaim-client-sdk'
import { CreateStep, ProviderName } from '@questbook/reclaim-node'

// eslint-disable-next-line no-restricted-syntax
export enum ClaimStatus {
  UNCLAIMED = 'unclaimed',
  PENDING = 'pending',
  MINTED = 'minted',
  REJECTED = 'rejected',
}

export interface Claim extends Omit<BaseClaim, 'ownerPublicKey' | 'provider'> {
  internalId: number
  title: string
  params?: {
    [key: string]: string | number
  }
  status: ClaimStatus
  statusMessage?: CreateStep['name']
  errorMessage?: string
  provider: ProviderType
  claimProvider: ProviderName
  ownerPublicKey: string
  signatures?: string[]
}

export interface Link extends Omit<BaseLink, 'claims'> {
  // id: string;
  // title: string;
  // identity?: string;
  claims: Claim[]
  template?: Template
  isSubmitted?: boolean
}
