import { Link, VerificationRequest } from '../api'

export type IUser = {
	id: string
	createdAtS: number
	updatedAtS: number
	firebaseToken: string | null
}

export type GetLinksOptions = {
	id: Link['id']
	userId: string
	page: number
	count: number
}

export type GetUserOptions = {
	id: string
}

export type GetClaimOptions = {
	ownerId: string
}
export type GetVerificationsOptions = {
	userId: string
}

export type GetEphemeralOpts = {
	id: string
	address: string
}

export type GetVerificationRequestsOptions = {
	id: string
	requestorOrClaimerId: string
	expiresAtS: {
		lt: number
	}

	offset: number
	count: number
}

export interface Repository {
	getLinks(opts: Partial<GetLinksOptions>): Promise<Link[]>
	insertLink(link: Link): Promise<void>
	insertVerificationRequest(entity: VerificationRequest): Promise<void>
	updateVerificationRequest(id: string, update: Partial<VerificationRequest>): Promise<void>
	getVerificationRequests(req: Partial<GetVerificationRequestsOptions>): Promise<VerificationRequest[]>
	updateLink(id: string, update: Partial<Link>): Promise<void>
	getUser(opts: Partial<GetUserOptions>): Promise<IUser>
	upsertUser(user: IUser): Promise<IUser>
	close(): Promise<void>
}

