import { CLIENT_ID, CLIENT_SECRET } from '@env'
import { upperFirst } from 'lodash'

export default async function getAccessToken(code: string) {
	return fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		/* eslint-disable camelcase */
		body: JSON.stringify({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			code,
		}),
	}).then((res) => res.json())
}

export async function getUserInfo(accessToken: string, tokenType: string) {
	return fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${upperFirst(tokenType) ?? 'Bearer'} ${accessToken}`,
		},
	}).then((res) => res.json())
}
