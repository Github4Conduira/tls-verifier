import providersReducer from '@app/providers/reducer'
import { combineReducers } from '@reduxjs/toolkit'
import linksReducer from './links'
import mintedClaimReducer from './mintedClaims'
import notificationsReducer from './notifications'
import userWalletReducer from './userWallet'


const rootReducer = combineReducers({
  providers: providersReducer,
  links: linksReducer,
  notifications: notificationsReducer,
  userWallet: userWalletReducer,
});


export default rootReducer
