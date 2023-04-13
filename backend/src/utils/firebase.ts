import { getMessaging } from 'firebase-admin/messaging'
import { App as FirebaseApp } from '../firebase/index'
import { Repository } from '../types/repository'

const sendNotification = async(
	rawNotification: {
		title: string
		body: string
		data: { [key: string]: string }
	},
	config: {
		userId: string
		repository: Repository
		firebaseApp: FirebaseApp
	}
) => {

	const { firebaseToken } = await config.repository.getUser({ id: config.userId })

	const notification = {
		notification: {
			title: rawNotification.title,
			body: rawNotification.body,
		},
		data: rawNotification.data,
		token: firebaseToken
	}

	await getMessaging(config.firebaseApp).send(notification)
}


export default sendNotification