import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Action, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE,
} from 'redux-persist'
import rootReducer from './rootReducer'

/*
    there's a bug with asyncStorage & react native debugger causing state not to persist
    when running the debugger.
    https://github.com/rt2zz/redux-persist/issues/719
*/
export const config = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['links', 'notifications', 'userWallet'],
}

const persistedReducer = persistReducer(config, rootReducer)

const persistedStore = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}),
})

const persistor = persistStore(persistedStore)

export type AppDispatch = typeof persistedStore.dispatch;

export type RootState = ReturnType<typeof persistedReducer>;

export const useReduxDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector

export type ThunkAction<
  R, // Return type of the thunk function
  S, // state type used by getState
  E, // any "extra argument" injected into the thunk
  A extends Action // known types of actions that can be dispatched
> = (dispatch: ThunkDispatch<S, E, A>, getState: () => S, extraArgument: E) => R;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default { persistedStore, persistor }
