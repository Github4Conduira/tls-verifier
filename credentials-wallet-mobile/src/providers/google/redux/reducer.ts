import { combineReducers } from 'redux'
import userInfoReducer from './userInfo'

/**
 * googleReducer
 * @description This is the root reducer for the google folder
 * @instructions Add your reducers from the google redux folder to the combineReducers function
 */
const googleReducer = combineReducers({
	userInfo: userInfoReducer,
})

export default googleReducer
