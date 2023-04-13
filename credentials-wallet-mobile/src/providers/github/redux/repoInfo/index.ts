import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RepoState {
  repo: string | null
}

const initialState: RepoState = {
	repo: null,
}

const repoInfoSlice = createSlice({
	name: 'repoInfo',
	initialState,
	reducers: {
		setRepoInfo: (state, action: PayloadAction<RepoState>) => ({
			...state,
			...action.payload,
		}),
	},
})

export const { setRepoInfo } = repoInfoSlice.actions
export default repoInfoSlice.reducer
