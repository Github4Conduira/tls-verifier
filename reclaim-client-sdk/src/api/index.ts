import { authoriseWalletForClaimCreation, createSignDataForCommunicationKey, encryptClaimProof, signatures } from '@questbookapp/reclaim-crypto-sdk';
import { ClaimProofInterface } from '../types';
import { Wallet } from 'ethers';
import { arrayify } from 'ethers/lib/utils'
import { makeGrpcClient } from '../api-client';
import { CreateLinkRequest, CreateLinkResponse, GetLinksResponse, CreateVerificationRequestRequest, CreateVerificationRequestResponse, GetVerificationRequestsResponse, GetVerificationRequestsRequest, EncryptedClaimProof, UpdateUserResponse, GetLinksRequest, GetServiceMetadataResponse, StartClaimCreationResponse, AcceptVerificationRequestResponse, SucceedVerificationRequestResponse, RejectVerificationRequestResponse } from '../proto'
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport';
import { grpc } from "@improbable-eng/grpc-web";

const transport = ReactNativeTransport({
	withCredentials: false,
});

grpc.setDefaultTransport(transport);

export class ReclaimWalletBackendClient {
	private readonly privateKey: string;

	constructor(private readonly _privateKey: string) {
		this.privateKey = _privateKey;
	}

	private getClient = async () => {
		const client = await makeGrpcClient(this.privateKey)
		return client;
	}

	public async updateUser(firebaseToken: string): Promise<UpdateUserResponse> {

		const client = await this.getClient();

		try {
			const response = await client.updateUser({ firebaseToken })
			return response
		} catch (e) {
			throw e
		}

	}

	public async createLink(link: CreateLinkRequest): Promise<CreateLinkResponse> {
		const client = await this.getClient();

		const response = await client.createLink({
			name: link.name,
			claims: link.claims
		})

		return response
	}

	public async getLinks(request: GetLinksRequest): Promise<GetLinksResponse> {
		const client = await this.getClient();
		try {
			const response = await client.getLinks({
				id: request.id,
				view: request.view
			})

			return response
		} catch (e) {
			throw e
		}

	}

	public async getServiceMetadata(): Promise<GetServiceMetadataResponse> {
		const client = await this.getClient();
		try {
			const response = await client.getServiceMetadata({})

			return response
		} catch (e) {
			throw e
		}
	}

	public async startClaimCreation(ephemeralWallet: Wallet, requestor: string, infoHash: string): Promise<StartClaimCreationResponse> {
		const { signature, expiryMs } = await authoriseWalletForClaimCreation(ephemeralWallet, requestor, { infoHash })

		const client = await this.getClient();

		try {
			const response = await client.startClaimCreation(
				{
					infoHash: arrayify(infoHash),
					authorisationSignature: signature,
					expiryTimestampMs: expiryMs,
					captchaToken: ''
				}
			)

			return response
		} catch (e) {
			throw e
		}

	}

	public async createVerificationReq(request: Omit<CreateVerificationRequestRequest, 'communicationSignature'>): Promise<CreateVerificationRequestResponse> {

		const data = createSignDataForCommunicationKey(
			{
				communicationPublicKey: request.communicationPublicKey,
				linkId: request.linkId,
				context: request.context
			})

		const signature = await signatures.sign(data, this.privateKey)

		const client = await this.getClient();

		try {
			const response = await client.createVerificationRequest({
				linkId: request.linkId,
				communicationPublicKey: request.communicationPublicKey,
				communicationSignature: signature,
				context: request.context
			})

			return response
		} catch (e) {
			throw e
		}

	}

	public async getVerificationReq(request: GetVerificationRequestsRequest): Promise<GetVerificationRequestsResponse> {
		const client = await this.getClient();

		try {
			const response = await client.getVerificationRequests({
				id: request.id,
				pagination: request.pagination
			})

			return response
		} catch (e) {
			throw e
		}
	}

	public async acceptVerificationRequest(verificationRequestId: string, communicationPublicKey: string, ephemeralPrivateKey: string, data: ClaimProofInterface[]): Promise<AcceptVerificationRequestResponse> {
		const client = await this.getClient();

		let enc: EncryptedClaimProof[] = []

		for (const d of data) {
			const encodedSig = d.signatures.map(s => arrayify(s))
			const encryptedProof = encryptClaimProof(Buffer.from(communicationPublicKey, 'base64'), arrayify(ephemeralPrivateKey), { parameters: d.parameters, signatures: encodedSig })

			enc.push({
				id: d.id,
				enc: encryptedProof
			})
		}

		try {
			const response = await client.acceptVerificationRequest({
				id: verificationRequestId,
				encryptedClaimProofs: enc
			})

			return response
		} catch (e) {
			throw e
		}

	}

	public async succeedVerificationRequest(verificationRequestId: string): Promise<SucceedVerificationRequestResponse> {
		const client = await this.getClient();

		try {
			const response = await client.succeedVerificationRequest({
				id: verificationRequestId
			})

			return response
		} catch (e) {
			throw e
		}

	}

	public async rejectVerificationRequest(verificationRequestId: string): Promise<RejectVerificationRequestResponse> {
		const client = await this.getClient();

		try {
			const response = await client.rejectVerificationRequest({
				id: verificationRequestId
			})

			return response
		} catch (e) {
			throw e
		}

	}
}