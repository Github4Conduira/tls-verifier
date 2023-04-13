import { credential } from 'firebase-admin'
import { App, initializeApp } from 'firebase-admin/app'
import { NODE_ENV } from '../config'

const firebaseAppConfig = {
	credential: credential.cert('./fbAdminConfig.json')
}

const firebaseApp = NODE_ENV !== 'test' ?
	initializeApp(firebaseAppConfig, 'reclaim-backend') : initializeApp()

export { firebaseApp, App }
