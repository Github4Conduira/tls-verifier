import { ClaimProofInterface } from '../types';
import { Wallet } from 'ethers';
import { CreateLinkRequest, CreateLinkResponse, GetLinksResponse, CreateVerificationRequestRequest, CreateVerificationRequestResponse, GetVerificationRequestsResponse, GetVerificationRequestsRequest, UpdateUserResponse, GetLinksRequest, GetServiceMetadataResponse, StartClaimCreationResponse, AcceptVerificationRequestResponse, SucceedVerificationRequestResponse, RejectVerificationRequestResponse } from '../proto';
export declare class ReclaimWalletBackendClient {
    private readonly _privateKey;
    private readonly privateKey;
    constructor(_privateKey: string);
    private getClient;
    updateUser(firebaseToken: string): Promise<UpdateUserResponse>;
    createLink(link: CreateLinkRequest): Promise<CreateLinkResponse>;
    getLinks(request: GetLinksRequest): Promise<GetLinksResponse>;
    getServiceMetadata(): Promise<GetServiceMetadataResponse>;
    startClaimCreation(ephemeralWallet: Wallet, requestor: string, infoHash: string): Promise<StartClaimCreationResponse>;
    createVerificationReq(request: Omit<CreateVerificationRequestRequest, 'communicationSignature'>): Promise<CreateVerificationRequestResponse>;
    getVerificationReq(request: GetVerificationRequestsRequest): Promise<GetVerificationRequestsResponse>;
    acceptVerificationRequest(verificationRequestId: string, communicationPublicKey: string, ephemeralPrivateKey: string, data: ClaimProofInterface[]): Promise<AcceptVerificationRequestResponse>;
    succeedVerificationRequest(verificationRequestId: string): Promise<SucceedVerificationRequestResponse>;
    rejectVerificationRequest(verificationRequestId: string): Promise<RejectVerificationRequestResponse>;
}
