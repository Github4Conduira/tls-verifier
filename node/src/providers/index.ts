import amazonOrderHistory from './amazon-order-history'
import githubContributor from './github'
import googleLogin from './google-login'
import httpProvider from './http-provider'
import mockLogin from './mock-login'
import YCombinatorLogin from './ycombinator-login'

const providers = {
	'google-login': googleLogin,
	'mock-login': mockLogin,
	'amazon-order-history': amazonOrderHistory,
	'yc-login': YCombinatorLogin,
	'github-contributor':githubContributor,
	'http':httpProvider
}

export type ProviderName = keyof typeof providers

type Provider<E extends ProviderName> = (typeof providers)[E]

export type ProviderParams<E extends ProviderName> = Parameters<Provider<E>['assertValidProviderReceipt']>[1]

export type ProviderSecretParams<E extends ProviderName> = Parameters<Provider<E>['createRequest']>[0]

export default providers