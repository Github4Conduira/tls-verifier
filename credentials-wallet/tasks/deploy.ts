import { task } from 'hardhat/config'

const DEFAULT_INITIAL_SUPPLY = '1000000000'

task('deploy', 'Deploy contract')
	.setAction(async(taskArgs, { ethers, network }) => {
		const signerAddress = await ethers.provider.getSigner().getAddress()
		console.log(`deploying contracts to "${network.name}" from address "${signerAddress}"`)

		const factory = await ethers.getContractFactory('CREDCoin')

		const estimatedGas = await ethers.provider.estimateGas(
			factory.getDeployTransaction(1)
		)
		console.log(`gas cost for deploying contract: ${ethers.utils.formatEther(estimatedGas)}ETH`)

		const contract = await factory.deploy(DEFAULT_INITIAL_SUPPLY)
		await contract.deployed()

		console.log('deployed contract to: ', contract.address)
	})