type GithubError = {
	message: string
	documentation_url?: string
	errors?: unknown[]
}

export const isGithubError = (error: unknown): error is GithubError => {
	return typeof error === 'object' && error !== null && (error.hasOwnProperty('message') && (error.hasOwnProperty('documentation_url') || error.hasOwnProperty('errors')))
}