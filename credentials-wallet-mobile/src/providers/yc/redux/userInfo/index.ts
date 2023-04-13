import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface userInfoState {
  cookieStr: string | undefined
  userId: number | undefined
}

const initialState: userInfoState = {
	cookieStr: undefined,
	userId: undefined,
}

const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<userInfoState>) => ({
			...state,
			...action.payload,
		}),
	},
})

export const { setUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
