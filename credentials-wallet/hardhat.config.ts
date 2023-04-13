import dotenv from 'dotenv'
dotenv.config()

import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import './tasks'

const { PRIVATE_KEY, ALCHEMY_API_KEY, NETWORK } = process.env

if(!PRIVATE_KEY) {
	throw new Error('PRIVATE_KEY not set')
}

if(!ALCHEMY_API_KEY) {
	throw new Error('ALCHEMY_API_KEY not set')
}

const API_TEMPLATE = 'https://{{network}}.alchemyapi.io/v2/{{key}}'

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.17',
		settings: {
			viaIR: true,
			optimizer: {
			  enabled: true,
			  runs: 10,
			},
		},
	},
	defaultNetwork: NETWORK,
	networks: {
		hardhat: {},
		...(NETWORK
			? {
				[NETWORK]: {
					url: API_TEMPLATE
						.replace('{{network}}', NETWORK)
						.replace('{{key}}', ALCHEMY_API_KEY),
					// uncomment to make tx goes faster
					// gasPrice: 15000000000,
					accounts: [PRIVATE_KEY]
				},
			}
			: {}
		)
	},
	typechain: {
		outDir: 'src/types',
		target: 'ethers-v5',
	},
}

export default config
