import { RootState } from '@app/redux/config'

export const getUserPublicKey = (state: RootState) => state.userWallet.publicKey
export const getUserPrivateKey = (state: RootState) => state.userWallet.privateKey

export const getEphemeralPublicKey = (state: RootState) => state.userWallet.ephemeralPublicKey
export const getEphemeralPrivateKey = (state: RootState) => state.userWallet.ephemeralPrivateKey

export const getFcmToken = (state: RootState) => state.userWallet.fcmToken
