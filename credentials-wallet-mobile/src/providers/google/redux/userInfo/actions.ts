/**
 * @fileoverview Actions for user info
 * @description This file contains the actions for the user info slice
 */
import { setUserInfo } from '@app/providers/google/redux/userInfo'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { googleLogin } from './utils'

export const fetchGoogleInfo = createAsyncThunk(
	'google/fetchGoogleInfoStatus',
	async(arg, thunkAPI) => {
		const googleInfo = await googleLogin()

		if(!googleInfo) {
			return
		}

		const { email, accessToken } = googleInfo
		if(!email || !accessToken) {
			throw Error('Missing email or access token')
		}

		thunkAPI.dispatch(setUserInfo({ email, accessToken }))
	}
)
