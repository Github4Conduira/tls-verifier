import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserWallet {
  publicKey: string
  privateKey: string
  ephemeralPublicKey: string
  ephemeralPrivateKey: string
  fcmToken: string | undefined
}

const initialState: UserWallet = {
	publicKey: '',
	privateKey: '',
	ephemeralPublicKey: '',
	ephemeralPrivateKey: '',
	fcmToken: undefined,
}

const userWalletSlice = createSlice({
	name: 'userWallet',
	initialState,
	reducers: {
		setPublicKey(state, action: PayloadAction<string>) {
			state.publicKey = action.payload
		},
		setPrivateKey(state, action: PayloadAction<string>) {
			state.privateKey = action.payload
		},
		setEphemeralPublicKey(state, action: PayloadAction<string>) {
			state.ephemeralPublicKey = action.payload
		},
		setEphemeralPrivateKey(state, action: PayloadAction<string>) {
			state.ephemeralPrivateKey = action.payload
		},
		setFcmToken: (state, action: PayloadAction<string>) => ({
			...state,
			fcmToken: action.payload,
		}),
	},
})

export const {
	setPublicKey,
	setPrivateKey,
	setEphemeralPrivateKey,
	setEphemeralPublicKey,
	setFcmToken,
} = userWalletSlice.actions
export default userWalletSlice.reducer
