import githubReducer from '@app/providers/github/redux/reducers'
import googleReducer from '@app/providers/google/redux/reducer'
import ycReducer from '@app/providers/yc/redux/reducer'
import { combineReducers } from 'redux'

/**
 * providersReducer
 * @description This is the root reducer for the providers folder
 * @instructions Add your reducers from the providers folder to the combineReducers function
 */
const providersReducer = combineReducers({
	google: googleReducer,
	yc: ycReducer,
	github: githubReducer,
})

export default providersReducer
