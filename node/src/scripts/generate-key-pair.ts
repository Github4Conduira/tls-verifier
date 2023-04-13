import { randomBytes } from 'crypto'
import { writeFileSync } from 'fs'

const privateKey = `0x${randomBytes(32).toString('hex')}`
const envFile = `PRIVATE_KEY=${privateKey}`

writeFileSync('./resources/keypair.json', envFile)

console.log('Wrote .env.production w private key')