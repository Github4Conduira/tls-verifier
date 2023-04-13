import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GithubUserState {
  accessToken: string | null
  username: string | null

}

const initialState: GithubUserState = {
	accessToken: null,
	username: null
}

const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<Partial<GithubUserState>>) => ({
			...state,
			...action.payload,
		}),
	},
})


export const { setUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
