import { createSignDataForClaim, hashClaimInfo } from '@questbookapp/reclaim-crypto-sdk'
import { utils } from 'ethers'
import { createChannel, createClient } from 'nice-grpc'
import { createClaim, generateProviderReceipt } from '../api-client'
import { ReclaimWitnessDefinition } from '../proto/api'
import { makeGrpcServer } from '../server/make-grpc-server'
import { SelectedServiceSignature } from '../signatures'
import { unixTimestampSeconds } from '../utils'
import { createMockServer } from './mock-provider-server'

const MOCK_APP_NAME = 'mock-login'
const MOCK_PARAMS = JSON.stringify({ emailAddress: 'adhiraj@mock.com' })

jest.mock('../utils/requests', () => {
	return {
		getClaimDataFromRequestId: jest.fn(
			() => {
				return {
					infoHash: hashClaimInfo({
						provider: MOCK_APP_NAME,
						parameters: MOCK_PARAMS,
						context: ''
					}),
					owner: '0x0000000000000000000000000000000000000000',
					timestampS: unixTimestampSeconds(),
					claimId: 1
				}
			}
		),
	}
})

describe('Provider Tests', () => {
	const grpcServerPort = Math.floor(Math.random() * 10000 + 10000)
	const serverPort = 8881
	const grpcServerAddr = `localhost:${grpcServerPort}`

	const channel = createChannel(grpcServerAddr)
	const server = makeGrpcServer(grpcServerPort)
	const witnessServer = createMockServer(serverPort)

	beforeAll(async() => {
		await server
	})

	afterAll(async() => {
		await channel.close()
		await (await server).close()
		await witnessServer.server.close()
	})

	it('should generate a claim', async() => {
		const {
			claimData,
			signature,
		} = await generateProviderReceipt({
			name: MOCK_APP_NAME,
			secretParams: { token: 'adhiraj' },
			requestData: {
				chainId: 1,
				claimId: 1,
				info: {
					provider: MOCK_APP_NAME,
					parameters: MOCK_PARAMS,
					context: ''
				},
			},
			client: getGrpcClient(),
			additionalConnectOpts: {
				verifyServerCertificate: false
			}
		})

		const dataStr = createSignDataForClaim(claimData!)

		const expectedPubKey = await getVerifierPublicKey()
		const signer = utils.verifyMessage(
			dataStr,
			signature
		)

		const address = SelectedServiceSignature.getAddress(
			expectedPubKey
		)
		const addressHex = utils.hexlify(address)

		expect(signer.toLowerCase())
			.toEqual(addressHex)
	})

	it('should fail to generate a claim', async() => {
		await expect(
			generateProviderReceipt({
				name: MOCK_APP_NAME,
				secretParams: { token: 'wrong-token' },
				requestData: {
					chainId: 1,
					claimId: 1,
					info: {
						provider: MOCK_APP_NAME,
						parameters: MOCK_PARAMS,
						context: ''
					}
				},
				client: getGrpcClient(),
				additionalConnectOpts: {
					verifyServerCertificate: false
				}
			})
		).rejects.toThrowError(/Invalid email address/)
	})

	it('should create a claim', async() => {
		const { signatures } = await createClaim({
			name: MOCK_APP_NAME,
			params: JSON.parse(MOCK_PARAMS),
			secretParams: { token: 'adhiraj' },
			requestCreate: async() => {
				return {
					chainId: 1,
					claimId: 1,
					witnessHosts: [grpcServerAddr]
				}
			},
			makeGrpcClient() {
				return getGrpcClient()
			},
		})

		expect(signatures).toHaveLength(1)
	})

	async function getVerifierPublicKey() {
		const client = getGrpcClient()
		const res = await client.getVerifierPublicKey({ })

		return res.publicKey
	}

	function getGrpcClient() {
		return createClient(
			ReclaimWitnessDefinition,
			channel,
			{ }
		)
	}
})