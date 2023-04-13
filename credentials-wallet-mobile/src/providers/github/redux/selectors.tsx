import { PossibleClaimData } from '@app/providers'
import { getUserInfo } from '@app/providers/github/redux/userInfo/selectors'
import { getProviders } from '@app/providers/selectors'
import { RootState } from '@app/redux/config'
import { getRepoInfo } from './repoInfo/selectors'

export const getGithub = (state: RootState) => getProviders(state).github


export const getGithubClaimParams: PossibleClaimData<'github-contributor'>['getParams'] = (state: RootState) => {
	const repo = getRepoInfo(state).repo ?? ''
	return {
		repo,
	}
}


export const getGithubSecretParams: PossibleClaimData<'github-contributor'>['getSecretParams'] = (state: RootState) => {
	const token = getUserInfo(state).accessToken ?? ''
	const username = getUserInfo(state).username ?? ''
	const repo = getRepoInfo(state).repo ?? ''

	return {
		token,
		username,
		repo,
	}
}