import uuid from 'react-native-uuid'
import { Link } from '@app/redux/links/types'

export const tempLink: Link = {
	id: uuid.v4().toString(),
	name: '',
	claims: [],
	userId: 'tempId',
	createdAtS: Math.floor(Date.now() / 1000),
	views: 0,
}
