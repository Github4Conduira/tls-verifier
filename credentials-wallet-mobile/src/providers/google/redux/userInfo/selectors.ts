/**
 * @fileoverview Selectors for the Google user info state.
 */
import { getGoogle } from '@app/providers/google/redux/selectors'
import { RootState } from '@app/redux/config'
import { LoadingState } from '@app/redux/types'

export const getUserInfo = (state: RootState) => getGoogle(state).userInfo

export const getUserEmail = (state: RootState) => getUserInfo(state).email

export const isUserInfoLoaded = (state: RootState) => getUserInfo(state).loading === LoadingState.SUCCESS

export const isUserInfoLoading = (state: RootState) => getUserInfo(state).loading === LoadingState.PENDING

export const isTokenExpired = (state: RootState) => {
	const expiresAt = getUserInfo(state).expiresAt

	return expiresAt && expiresAt < Date.now()
}
