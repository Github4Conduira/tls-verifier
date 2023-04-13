import { createSignDataForClaim, hashClaimInfo } from '@reclaimprotocol/crypto-sdk'
import { utils } from 'ethers'
import { createChannel, createClient } from 'nice-grpc'
import { generateProviderReceipt } from '../api-client'
import { ReclaimWitnessDefinition } from '../proto/api'
import { HTTPProviderParams } from '../providers/http-provider'
import { extractHTMLElement, extractJSONValueIndex } from '../providers/http-provider/utils'
import { makeGrpcServer } from '../server/make-grpc-server'
import { SelectedServiceSignature } from '../signatures'
import { unixTimestampSeconds } from '../utils'
import { createMockServer } from './mock-provider-server'


const params: HTTPProviderParams = {
	url:'https://xargs.org/',
	method:'GET',
	responseSelections:[{
		xPath:'./html/head/title',
		responseMatch:'<title.*?Aiken &amp; Driscoll &amp; Webb<\\/title>'
	}]
}

jest.setTimeout(15_000)
jest.mock('../utils/requests', () => {
	return {
		getClaimDataFromRequestId: jest.fn(
			() => {
				return {
					infoHash: hashClaimInfo({
						provider: 'http',
						parameters: JSON.stringify(params),
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

describe('HTTP Provider Tests', () => {
	const grpcServerPort = Math.floor(Math.random() * 5000 + 5000)
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


	it('should parse xpath & JSON path', () => {
		const json = extractHTMLElement(html, '//script[@id=\'js-react-on-rails-context\']', true)
		const val = extractJSONValueIndex(json, '$..full_name')
		expect(json.slice(val.start, val.end)).toEqual('"full_name":"John Dow"')
	})


	it('should fetch & find claim in xargs', async() => {
		const xPaths = ['./html/head/title', undefined]
		for(let i = 0; i < 1; i++) {
			params.responseSelections[0].xPath = xPaths[i]
			const {
				claimData,
				signature,
			} = await generateProviderReceipt({
				name: 'http',
				secretParams: { cookieStr:'123=456' },
				params: params,
				requestData: {
					chainId: 1,
					claimId: 1,
					info: {
						provider: 'http',
						parameters: JSON.stringify(params),
						context: ''
					},
				},
				client: getGrpcClient()
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
		}
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


const html = `<!DOCTYPE html><html class="home index" lang="en"><head><title>Home | Bookface</title>
<div class="container page-body">
    <div class="content nomargin"><script type="application/json" id="js-react-on-rails-context">
    {"railsEnv":"production","inMailer":false,"i18nLocale":"en","i18nDefaultLocale":"en","rorVersion":"12.6.0","rorPro":false,"href":"https://bookface.ycombinator.com/home",
        "location":"/home","scheme":"https","host":"bookface.ycombinator.com","port":null,"pathname":"/home","search":null,"applyBatchLong":"Summer 2023",
        "applyBatchShort":"S2023","applyDeadlineShort":"April  7","ycdcRetroMode":false,
        "currentUser":{"id":123,"admin":false,"waas_admin":false,"yc_partner":false,
            "current_company":{"name":"test"},
            "company_for_deals":{"name":"test"},
            "full_name":"John Dow",
            "first_name":"John",
            "hnid":"johndow"},
        "serverSide":false}</script>
    </div>
</div>
</html>`