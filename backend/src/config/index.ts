import * as dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${nodeEnv}` })

export const DEFAULT_VERIFICATION_REQUEST_LIFETIME_H = 48

export const DEFAULT_PORT = 8003

export const PRIVATE_KEY = process.env.PRIVATE_KEY

export const DEFAULT_MINT_CHAIN_ID = 0x1a4

export const DB_URI = process.env.DB_URI

export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID

export const FIREBASE_PROJECT_API_KEY = process.env.FIREBASE_PROJECT_API_KEY

export const FIREBASE_ANDROID_APP_ID = process.env.FIREBASE_ANDROID_APP_ID

export const FIREBASE_IOS_APP_ID = process.env.FIREBASE_IOS_APP_ID

export const FIREBASE_SENDER_ID = process.env.FIREBASE_SENDER_ID

export const NODE_ENV = process.env.NODE_ENV
