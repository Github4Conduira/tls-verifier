import getAccessToken, { getUserInfo } from '@app/lib/utils/githubAuth';

export const fetchGithubInfo = async (code: string) => {
  const { access_token: accessToken, token_type: tokenType } = await getAccessToken(code);
  const { login: username } = await getUserInfo(accessToken, tokenType);

  if (!username || !accessToken) {
    throw new Error('Failed to fetch github user info');
  }

  return {
    accessToken,
    username,
  };
};
