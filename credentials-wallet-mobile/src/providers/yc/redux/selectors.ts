import { PossibleClaimData } from '@app/providers'
import { getProviders } from '@app/providers/selectors'
import { getUserInfo } from '@app/providers/yc/redux/userInfo/selectors'
import { RootState } from '@app/redux/config'

export const getYc = (state: RootState) => getProviders(state).yc

export const getYcLoginParams: PossibleClaimData<'yc-login'>['getParams'] = (state: RootState) => {
	const userId = getUserInfo(state).userId ?? 0

	return {
		userId,
	}
}

export const getYcSecretParams: PossibleClaimData<'yc-login'>['getSecretParams'] = (
	state: RootState
) => {
	const cookieStr = getUserInfo(state).cookieStr ?? ''

	return {
		cookieStr,
	}
}
