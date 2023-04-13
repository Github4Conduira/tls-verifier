import { config } from 'dotenv'

const nodeEnv = process.env.NODE_ENV || 'development'
config({ path: `.env.${nodeEnv}` })

export const API_SERVER_PORT = 8001

export const PRIVATE_KEY = process.env.PRIVATE_KEY!

export const MAX_ZK_CHUNKS = 40

export const RECLAIM_USER_AGENT = 'reclaim/0.0.1'