import { fetchGoogleInfo } from './actions';
import { LoadingState } from '@app/redux/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * userInfoState
 * @description This is the type of the userInfo slice
 * @property email - The user's email
 * @property accessToken - The user's access token
 * @property expiresAt - The time at which the access token expires
 * @property loading - The loading state of the slice
 */
interface userInfoState {
  email: string | undefined;
  accessToken: string | undefined;
  expiresAt: number | undefined;
  loading: LoadingState;
}

/**
 * initialState
 * @description This is the initial state of the userInfo slice
 */
const initialState: userInfoState = {
  email: undefined,
  accessToken: undefined,
  expiresAt: undefined,
  loading: LoadingState.IDLE,
};

/**
 * userInfoSlice
 * @description This slice is responsible for storing the user's information
 **/
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Omit<userInfoState, 'loading' | 'expiresAt'>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  // This is where we handle the async actions
  extraReducers: (builder) => {
    builder.addCase(fetchGoogleInfo.pending, (state, action) => ({
      ...state,
      loading: LoadingState.PENDING,
    }));
    builder.addCase(fetchGoogleInfo.fulfilled, (state, action) => ({
      ...state,
      loading: LoadingState.SUCCESS,
      expiresAt: Date.now() + 60 * 60 * 1000,
    }));
    builder.addCase(fetchGoogleInfo.rejected, (state, action) => ({
      ...state,
      loading: LoadingState.FAILURE,
    }));
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
