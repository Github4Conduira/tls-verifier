import { combineReducers } from 'redux'
import repoInfoReducer from './repoInfo'
import userInfoReducer from './userInfo'

const githubReducer = combineReducers({
	userInfo: userInfoReducer,
	repoInfo: repoInfoReducer,
})

export default githubReducer
