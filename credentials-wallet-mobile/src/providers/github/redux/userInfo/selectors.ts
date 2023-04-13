import { getGithub } from '@app/providers/github/redux/selectors'
import { RootState } from '@app/redux/config'


export const getUserInfo = (state: RootState) => getGithub(state).userInfo

