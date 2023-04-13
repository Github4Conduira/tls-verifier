import { RECLAIM_USER_AGENT } from '../../config'
import { Provider } from '../../types'
import {
	getCompleteHttpResponseFromTranscript,
	getHttpRequestHeadersFromTranscript,
} from '../../utils/http-parser'
import { isGithubError } from './utils'

type GithubLoginParams = {
	repo: string
}

type GithubRepoContributorsListSecretParams = {
	token: string
	username: string
	repo: string
}

const HOST = 'api.github.com'
const PORT = 443
const HOSTPORT = `${HOST}:${PORT}`

// repos/{owner}/{repo}/commits
// what API to call
const METHOD = 'GET'
const URL = '/repos'

const githubContributor: Provider<
	GithubLoginParams,
	GithubRepoContributorsListSecretParams
> = {
	hostPorts: [HOSTPORT],
	areValidParams(params): params is GithubLoginParams {
		const { repo } = params
		return (
			typeof repo === 'string' &&
			repo.indexOf('/') > -1 &&
			repo.split('/').length === 2
		)
	},
	createRequest({ token, repo, username }) {
		const PATH = `${URL}/${repo}/commits?committer=${username}&per_page=1`

		// serialise the HTTP request
		const strRequest = [
			`${METHOD} ${PATH} HTTP/1.1`,
			'Host: ' + HOST,
			'Connection: close',
			'Content-Length: 0',
			'X-GitHub-Api-Version: 2022-11-28',
			'Accept: application/vnd.github+json',
			`Authorization: Bearer ${token}`,
			`User-Agent: ${RECLAIM_USER_AGENT}`,
			'\r\n',
		].join('\r\n')

		// find the token and redact it
		const data = Buffer.from(strRequest)
		const tokenStartIndex = data.indexOf(token)

		return {
			data,
			// anything that should be redacted from the transcript
			// should be added to this array
			redactions: [
				{
					fromIndex: tokenStartIndex,
					toIndex: tokenStartIndex + token.length,
				}
			],
		}
	},
	assertValidProviderReceipt(receipt) {
		// ensure the request was sent to the right place
		if(receipt.hostPort !== HOSTPORT) {
			throw new Error(`Invalid hostPort: ${receipt.hostPort}`)
		}

		// parse the HTTP request & check
		// the method, URL, headers, etc. match what we expect
		const req = getHttpRequestHeadersFromTranscript(receipt.transcript)
		if(req.method !== METHOD.toLowerCase()) {
			throw new Error(`Invalid method: ${req.method}`)
		}

		if(!req.url.startsWith(URL)) {
			throw new Error(`Invalid URL: ${req.url}`)
		}

		// we ensure the connection header was sent as "close"
		// this is done to avoid any possible malicious request
		// that contains multiple requests, but via redactions
		// is spoofed as a single request
		if(req.headers['connection'] !== 'close') {
			throw new Error('Invalid connection header')
		}

		// now we parse the HTTP response & check
		// if the emailAddress returned by the API
		// matches the parameters the user provided
		const res = getCompleteHttpResponseFromTranscript(receipt.transcript)

		if(!res.headers['content-type']?.startsWith('application/json')) {
			throw new Error(`Invalid content-type: ${res.headers['content-type']}`)
		}

		const responseBody = JSON.parse(res.body.toString())

		if(res.statusCode !== 200) {
			if(isGithubError(responseBody)) {
				throw new Error(responseBody.message)
			}

			throw new Error(`Invalid status code: ${res.statusCode}`)
		}

		if(!Array.isArray(responseBody)) {
			throw new Error('Not found')
		}

		if(!responseBody.length) {
			throw new Error('Not a contributor to the given repo')
		}
	},
}

export default githubContributor
