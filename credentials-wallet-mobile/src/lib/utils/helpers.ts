import { Platform } from 'react-native'
import { ProviderName } from '@questbook/reclaim-node'
import CookieManager from '@react-native-cookies/cookies'

export function truncateAddress(addr: string) {
	const first = addr.substring(0, 3)
	const last = addr.slice(-3)
	return first + '...' + last
}

export async function fetchUserContribution(accessToken: string | null) {
	return fetch('https://api.github.com/user/repos', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	}).then((res) => res.json())
}

export async function getUserContribution(accessToken: string | null) {
	const data = await fetchUserContribution(accessToken)
	const userContributions: {
    name: string
    owner: string
    avatarURL: string
    lastCommit: string
  }[] = []
	for(let i = 0; i < data.length; i++) {
		const lastCommit = data[i].updated_at.substring(0, data[i].updated_at.indexOf('T'))
		const name = data[i].full_name.substring(data[i].full_name.indexOf('/') + 1)
		const contribution = {
			name: name,
			owner: data[i].owner.login,
			avatarURL: data[i].owner.avatar_url,
			lastCommit: lastCommit,
		}
		userContributions.push(contribution)
	}

	return userContributions
}

export function createRedactedString(parameter: string, provider: ProviderName): string {
	if(provider === 'yc-login' || provider === 'github-contributor') {
		return new Array(parameter.toString().length).fill('*').join('')
	}

	const email = parameter.split('@')
	const domain = email[1]

	const redacted = new Array(email[0].length).fill('*')

	return redacted.join('') + '@' + domain
}

export function createRedactedParams(
	parameter: string,
	paramKey: string,
	provider: ProviderName
): string {
	if(provider === 'yc-login') {
		return `{"${paramKey}":${createRedactedString(parameter, provider)}}`
	}

	return `{"${paramKey}":"${createRedactedString(parameter, provider)}"}`
}

export const getCookies = (url: string) => {
	return Platform.OS === 'ios' ? CookieManager.getAll(true) : CookieManager.get(url)
}
