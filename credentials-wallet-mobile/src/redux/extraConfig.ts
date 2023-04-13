import { AppDispatch, RootState } from '@app/redux/config'
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit'

export const typedCreateAsyncThunk = <ReturnType = void, ThunkArg = void>(
	typePrefix: string,
	payloadCreator: AsyncThunkPayloadCreator<
    ReturnType,
    ThunkArg,
    { dispatch: AppDispatch, state: RootState }
  >
) => createAsyncThunk(typePrefix, payloadCreator)
