import { Wallet } from 'ethers'
import { PRIVATE_KEY } from '../config'

export const MINT_SIGNER = new Wallet(PRIVATE_KEY)