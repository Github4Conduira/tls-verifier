import { ProviderType } from '@app/providers'
import { CreateClaimOptions, ProviderName } from '@questbook/reclaim-node'

export interface BaseTemplateClaim {
  provider: ProviderName
  params?: CreateClaimOptions<ProviderName>['params']
}

export interface TemplateClaim extends Omit<BaseTemplateClaim, 'provider'> {
  id: number
  provider: ProviderType
  claimProvider: ProviderName
}

export interface BaseTemplate {
  id: string
  name: string
  firebaseToken: string
  publicKey: string
  claims: BaseTemplateClaim[]
  callbackUrl: string
}

export interface Template extends Omit<BaseTemplate, 'claims'> {
  claims: TemplateClaim[]
}
