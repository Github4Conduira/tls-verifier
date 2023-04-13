import { combineReducers } from 'redux'
import userInfoReducer from './userInfo'

const ycReducer = combineReducers({
	userInfo: userInfoReducer,
})

export default ycReducer
