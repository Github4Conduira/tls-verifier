/**
 * @fileoverview Selectors for the Yc user info state.
 */
import { getYc } from '@app/providers/yc/redux/selectors'
import { RootState } from '@app/redux/config'

export const getUserInfo = (state: RootState) => getYc(state).userInfo

export const getUserId = (state: RootState) => getUserInfo(state).userId

export const getUserIdString = (state: RootState) => getUserId(state)?.toString()
// export const isTokenExpired = (state: RootState) => {
//     const expiresAt = getUserInfo(state).expiresAt;

//     return expiresAt && expiresAt < Date.now();
// }
