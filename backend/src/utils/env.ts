import * as dotenv from 'dotenv'

export default function loadEnv() {

	if(process.env.NODE_ENV === 'production') {
		dotenv.config({ path: '.env.production' })
	} else {
		dotenv.config({ path: '.env.development' })
	}
}

