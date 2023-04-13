import { getGithub } from '@app/providers/github/redux/selectors'
import { RootState } from '@app/redux/config'


export const getRepoInfo = (state: RootState) => getGithub(state).repoInfo
