import { CLIENT_ID, CLIENT_SECRET } from '@env';
import { upperFirst } from 'lodash';

export default async function getAccessToken(code: string) {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }),
  }).then((res) => res.json());
}

export async function getUserInfo(access_token: string, token_type: string) {
  return fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `${upperFirst(token_type) ?? `Bearer`} ${access_token}`,
    },
  }).then((res) => res.json());
}
