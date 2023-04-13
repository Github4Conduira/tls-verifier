import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "reclaim_backend";
export declare enum VerificationRequestStatus {
    /** VERIFICATION_REQUEST_STATUS_PENDING - when then requestor initially asks for verification */
    VERIFICATION_REQUEST_STATUS_PENDING = 0,
    /**
     * VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL - when the claimer has responded,
     * waiting for the requestor to accept/reject the proof
     */
    VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL = 1,
    /** VERIFICATION_REQUEST_STATUS_DONE - successfully verified the request */
    VERIFICATION_REQUEST_STATUS_DONE = 2,
    /** VERIFICATION_REQUEST_STATUS_EXPIRED - the request expired, either party failed to respond in time */
    VERIFICATION_REQUEST_STATUS_EXPIRED = 4,
    /** VERIFICATION_REQUEST_STATUS_FAILED - the requestor failed to provide a valid proof */
    VERIFICATION_REQUEST_STATUS_FAILED = 5,
    /** VERIFICATION_REQUEST_STATUS_REJECTED - claimer rejected the request */
    VERIFICATION_REQUEST_STATUS_REJECTED = 6,
    UNRECOGNIZED = -1
}
export declare function verificationRequestStatusFromJSON(object: any): VerificationRequestStatus;
export declare function verificationRequestStatusToJSON(object: VerificationRequestStatus): string;
export interface LinkClaim {
    /** ID of the claim from the smart contract creation */
    id: number;
    /** the chain on which the claim lies */
    chainId: number;
    /** eg. google-login */
    provider: string;
    /**
     * Eg. if parameters = alice@creatoros.co,
     * redactedParameters = *****@creatoros.co
     */
    redactedParameters: string;
    /**
     * public key of the owner address,
     * that generated the claim
     */
    ownerPublicKey: Uint8Array;
    /** when the claim was created */
    timestampS: number;
    /**
     * list of addresses that attested to the claim's validity
     * note: this is the wallet address of the witness & not the host
     * eg. "0x123456789"
     * not required to be submitted in the request. Backend will
     * fetch the witness addresses from the smart contract
     */
    witnessAddresses: string[];
}
export interface Link {
    /** ID of the link; would be unique & pseudo-random */
    id: string;
    /**
     * the user that created the link
     * is blank when requested by anybody other than the creator
     */
    userId: string;
    /** name of the link */
    name: string;
    /** list of claims belonging to the link */
    claims: LinkClaim[];
    /**
     * when the link was created
     * unix timestamp in seconds
     */
    createdAtS: number;
    /** number of views the link has */
    views: number;
}
export interface ClaimProof {
    /** the full parameters of the claim */
    parameters: string;
    /**
     * signatures of the claim done by the witnesses
     * that attested to the claim's validity
     */
    signatures: Uint8Array[];
}
export interface EncryptedClaimProof {
    /** ID of the encrypted claim */
    id: number;
    /** encrypted claim proof */
    enc: Uint8Array;
}
export interface VerificationRequest {
    /** unique ID of this verification request */
    id: string;
    /** the link being verified */
    link: Link | undefined;
    /** reason for request; eg.: "we'd like to hire you" */
    context: string;
    /** status of the request */
    status: VerificationRequestStatus;
    /** Ephemeral public key for encrypted communication */
    communicationPublicKey: Uint8Array;
    /**
     * Signature of the ephemeral public key,
     * with the master key of the requestor
     */
    communicationSignature: Uint8Array;
    /** ID of the requestor; their wallet address */
    requestorId: string;
    /** when the request was created */
    createdAtS: number;
    /** when the request was updated */
    updatedAtS: number;
    /** request expiration date; unix timestamp in seconds */
    expiresAtS: number;
    /**
     * proofs sent in by the claimer;
     * should be encrypted "ClaimProof" structure
     */
    encryptedClaimProofs: EncryptedClaimProof[];
}
export interface Pagination {
    page: number;
    pageSize: number;
}
/** empty */
export interface GetServiceMetadataRequest {
}
export interface GetServiceMetadataResponse {
    walletAddress: string;
}
export interface GetLinksRequest {
    /** fetch a link with a specific ID */
    id: string;
    /**
     * if true, increments the view count of the links returned
     * will only increment if ID is set
     */
    view: boolean;
}
export interface GetLinksResponse {
    links: Link[];
}
export interface CreateLinkRequest {
    name: string;
    claims: LinkClaim[];
}
export interface CreateLinkResponse {
    /** ID of the link */
    id: string;
}
export interface UpdateUserRequest {
    /**
     * Token for notifications
     * Pass empty string to remove
     */
    firebaseToken: string;
}
export interface UpdateUserResponse {
}
export interface CreateVerificationRequestRequest {
    /** ID of the link to request verification from */
    linkId: string;
    /** Ephemeral public key for encrypted communication */
    communicationPublicKey: Uint8Array;
    /**
     * Signature of the ephemeral public key,
     * with the master key of the requestor
     */
    communicationSignature: Uint8Array;
    /** reason for the request */
    context: string;
}
export interface CreateVerificationRequestResponse {
    /** id of verification request */
    id: string;
}
export interface AcceptVerificationRequestRequest {
    /** ID of the verification request */
    id: string;
    /**
     * proofs of the claims;
     * for every claim =>
     *  K = DHKE(Pri(claim),communicationPublicKey)
     *  Encrypt(proto(ClaimProof), K)
     */
    encryptedClaimProofs: EncryptedClaimProof[];
}
/** empty */
export interface AcceptVerificationRequestResponse {
}
export interface RejectVerificationRequestRequest {
    /** ID of the verification request */
    id: string;
}
/** empty */
export interface RejectVerificationRequestResponse {
}
export interface SucceedVerificationRequestRequest {
    /** ID of the verification request */
    id: string;
}
/** empty */
export interface SucceedVerificationRequestResponse {
}
export interface FailVerificationRequestRequest {
    /** ID of the verification request */
    id: string;
    /**
     * the private key of the public key earlier
     * submitted in CreateVerificationRequest
     */
    communicationPrivateKey: Uint8Array;
}
/** empty */
export interface FailVerificationRequestResponse {
}
export interface GetVerificationRequestsRequest {
    /** optional ID of the verification request */
    id: string;
    pagination: Pagination | undefined;
}
export interface GetVerificationRequestsResponse {
    requests: VerificationRequest[];
    /** next page of requests; 0 if no more data */
    nextPage: number;
}
export interface StartClaimCreationRequest {
    /**
     * hash of the information in the claim
     * infoHash = Hash(provider,providerParams)
     */
    infoHash: Uint8Array;
    /** signature done by the owner to authorise the claim by QB */
    authorisationSignature: Uint8Array;
    /**
     * unix timestamp (in ms) after which
     * the signature cannot be used anymore
     */
    expiryTimestampMs: number;
    /** token from the captcha check */
    captchaToken: string;
}
export interface StartClaimCreationResponse {
    /** ID of the claim on the smart contract */
    claimId: number;
    /** the chain ID on which the creation was done */
    chainId: number;
    /**
     * the hosts of the witnesses
     * where the user needs to make the request
     */
    witnessHosts: string[];
}
export declare const LinkClaim: {
    encode(message: LinkClaim, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LinkClaim;
    fromJSON(object: any): LinkClaim;
    toJSON(message: LinkClaim): unknown;
    create(base?: DeepPartial<LinkClaim>): LinkClaim;
    fromPartial(object: DeepPartial<LinkClaim>): LinkClaim;
};
export declare const Link: {
    encode(message: Link, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Link;
    fromJSON(object: any): Link;
    toJSON(message: Link): unknown;
    create(base?: DeepPartial<Link>): Link;
    fromPartial(object: DeepPartial<Link>): Link;
};
export declare const ClaimProof: {
    encode(message: ClaimProof, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ClaimProof;
    fromJSON(object: any): ClaimProof;
    toJSON(message: ClaimProof): unknown;
    create(base?: DeepPartial<ClaimProof>): ClaimProof;
    fromPartial(object: DeepPartial<ClaimProof>): ClaimProof;
};
export declare const EncryptedClaimProof: {
    encode(message: EncryptedClaimProof, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedClaimProof;
    fromJSON(object: any): EncryptedClaimProof;
    toJSON(message: EncryptedClaimProof): unknown;
    create(base?: DeepPartial<EncryptedClaimProof>): EncryptedClaimProof;
    fromPartial(object: DeepPartial<EncryptedClaimProof>): EncryptedClaimProof;
};
export declare const VerificationRequest: {
    encode(message: VerificationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VerificationRequest;
    fromJSON(object: any): VerificationRequest;
    toJSON(message: VerificationRequest): unknown;
    create(base?: DeepPartial<VerificationRequest>): VerificationRequest;
    fromPartial(object: DeepPartial<VerificationRequest>): VerificationRequest;
};
export declare const Pagination: {
    encode(message: Pagination, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Pagination;
    fromJSON(object: any): Pagination;
    toJSON(message: Pagination): unknown;
    create(base?: DeepPartial<Pagination>): Pagination;
    fromPartial(object: DeepPartial<Pagination>): Pagination;
};
export declare const GetServiceMetadataRequest: {
    encode(_: GetServiceMetadataRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataRequest;
    fromJSON(_: any): GetServiceMetadataRequest;
    toJSON(_: GetServiceMetadataRequest): unknown;
    create(base?: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest;
    fromPartial(_: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest;
};
export declare const GetServiceMetadataResponse: {
    encode(message: GetServiceMetadataResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataResponse;
    fromJSON(object: any): GetServiceMetadataResponse;
    toJSON(message: GetServiceMetadataResponse): unknown;
    create(base?: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse;
    fromPartial(object: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse;
};
export declare const GetLinksRequest: {
    encode(message: GetLinksRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksRequest;
    fromJSON(object: any): GetLinksRequest;
    toJSON(message: GetLinksRequest): unknown;
    create(base?: DeepPartial<GetLinksRequest>): GetLinksRequest;
    fromPartial(object: DeepPartial<GetLinksRequest>): GetLinksRequest;
};
export declare const GetLinksResponse: {
    encode(message: GetLinksResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksResponse;
    fromJSON(object: any): GetLinksResponse;
    toJSON(message: GetLinksResponse): unknown;
    create(base?: DeepPartial<GetLinksResponse>): GetLinksResponse;
    fromPartial(object: DeepPartial<GetLinksResponse>): GetLinksResponse;
};
export declare const CreateLinkRequest: {
    encode(message: CreateLinkRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkRequest;
    fromJSON(object: any): CreateLinkRequest;
    toJSON(message: CreateLinkRequest): unknown;
    create(base?: DeepPartial<CreateLinkRequest>): CreateLinkRequest;
    fromPartial(object: DeepPartial<CreateLinkRequest>): CreateLinkRequest;
};
export declare const CreateLinkResponse: {
    encode(message: CreateLinkResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkResponse;
    fromJSON(object: any): CreateLinkResponse;
    toJSON(message: CreateLinkResponse): unknown;
    create(base?: DeepPartial<CreateLinkResponse>): CreateLinkResponse;
    fromPartial(object: DeepPartial<CreateLinkResponse>): CreateLinkResponse;
};
export declare const UpdateUserRequest: {
    encode(message: UpdateUserRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserRequest;
    fromJSON(object: any): UpdateUserRequest;
    toJSON(message: UpdateUserRequest): unknown;
    create(base?: DeepPartial<UpdateUserRequest>): UpdateUserRequest;
    fromPartial(object: DeepPartial<UpdateUserRequest>): UpdateUserRequest;
};
export declare const UpdateUserResponse: {
    encode(_: UpdateUserResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserResponse;
    fromJSON(_: any): UpdateUserResponse;
    toJSON(_: UpdateUserResponse): unknown;
    create(base?: DeepPartial<UpdateUserResponse>): UpdateUserResponse;
    fromPartial(_: DeepPartial<UpdateUserResponse>): UpdateUserResponse;
};
export declare const CreateVerificationRequestRequest: {
    encode(message: CreateVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestRequest;
    fromJSON(object: any): CreateVerificationRequestRequest;
    toJSON(message: CreateVerificationRequestRequest): unknown;
    create(base?: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest;
    fromPartial(object: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest;
};
export declare const CreateVerificationRequestResponse: {
    encode(message: CreateVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestResponse;
    fromJSON(object: any): CreateVerificationRequestResponse;
    toJSON(message: CreateVerificationRequestResponse): unknown;
    create(base?: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse;
    fromPartial(object: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse;
};
export declare const AcceptVerificationRequestRequest: {
    encode(message: AcceptVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestRequest;
    fromJSON(object: any): AcceptVerificationRequestRequest;
    toJSON(message: AcceptVerificationRequestRequest): unknown;
    create(base?: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest;
    fromPartial(object: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest;
};
export declare const AcceptVerificationRequestResponse: {
    encode(_: AcceptVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestResponse;
    fromJSON(_: any): AcceptVerificationRequestResponse;
    toJSON(_: AcceptVerificationRequestResponse): unknown;
    create(base?: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse;
    fromPartial(_: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse;
};
export declare const RejectVerificationRequestRequest: {
    encode(message: RejectVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestRequest;
    fromJSON(object: any): RejectVerificationRequestRequest;
    toJSON(message: RejectVerificationRequestRequest): unknown;
    create(base?: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest;
    fromPartial(object: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest;
};
export declare const RejectVerificationRequestResponse: {
    encode(_: RejectVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestResponse;
    fromJSON(_: any): RejectVerificationRequestResponse;
    toJSON(_: RejectVerificationRequestResponse): unknown;
    create(base?: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse;
    fromPartial(_: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse;
};
export declare const SucceedVerificationRequestRequest: {
    encode(message: SucceedVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestRequest;
    fromJSON(object: any): SucceedVerificationRequestRequest;
    toJSON(message: SucceedVerificationRequestRequest): unknown;
    create(base?: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest;
    fromPartial(object: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest;
};
export declare const SucceedVerificationRequestResponse: {
    encode(_: SucceedVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestResponse;
    fromJSON(_: any): SucceedVerificationRequestResponse;
    toJSON(_: SucceedVerificationRequestResponse): unknown;
    create(base?: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse;
    fromPartial(_: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse;
};
export declare const FailVerificationRequestRequest: {
    encode(message: FailVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestRequest;
    fromJSON(object: any): FailVerificationRequestRequest;
    toJSON(message: FailVerificationRequestRequest): unknown;
    create(base?: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest;
    fromPartial(object: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest;
};
export declare const FailVerificationRequestResponse: {
    encode(_: FailVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestResponse;
    fromJSON(_: any): FailVerificationRequestResponse;
    toJSON(_: FailVerificationRequestResponse): unknown;
    create(base?: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse;
    fromPartial(_: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse;
};
export declare const GetVerificationRequestsRequest: {
    encode(message: GetVerificationRequestsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsRequest;
    fromJSON(object: any): GetVerificationRequestsRequest;
    toJSON(message: GetVerificationRequestsRequest): unknown;
    create(base?: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest;
    fromPartial(object: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest;
};
export declare const GetVerificationRequestsResponse: {
    encode(message: GetVerificationRequestsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsResponse;
    fromJSON(object: any): GetVerificationRequestsResponse;
    toJSON(message: GetVerificationRequestsResponse): unknown;
    create(base?: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse;
    fromPartial(object: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse;
};
export declare const StartClaimCreationRequest: {
    encode(message: StartClaimCreationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationRequest;
    fromJSON(object: any): StartClaimCreationRequest;
    toJSON(message: StartClaimCreationRequest): unknown;
    create(base?: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest;
    fromPartial(object: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest;
};
export declare const StartClaimCreationResponse: {
    encode(message: StartClaimCreationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationResponse;
    fromJSON(object: any): StartClaimCreationResponse;
    toJSON(message: StartClaimCreationResponse): unknown;
    create(base?: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse;
    fromPartial(object: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse;
};
export declare type ReclaimBackendDefinition = typeof ReclaimBackendDefinition;
export declare const ReclaimBackendDefinition: {
    readonly name: "ReclaimBackend";
    readonly fullName: "reclaim_backend.ReclaimBackend";
    readonly methods: {
        /** Get metadata (including wallet address) about the service */
        readonly getServiceMetadata: {
            readonly name: "GetServiceMetadata";
            readonly requestType: {
                encode(_: GetServiceMetadataRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataRequest;
                fromJSON(_: any): GetServiceMetadataRequest;
                toJSON(_: GetServiceMetadataRequest): unknown;
                create(base?: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest;
                fromPartial(_: DeepPartial<GetServiceMetadataRequest>): GetServiceMetadataRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: GetServiceMetadataResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetServiceMetadataResponse;
                fromJSON(object: any): GetServiceMetadataResponse;
                toJSON(message: GetServiceMetadataResponse): unknown;
                create(base?: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse;
                fromPartial(object: DeepPartial<GetServiceMetadataResponse>): GetServiceMetadataResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** get links created by the user */
        readonly getLinks: {
            readonly name: "GetLinks";
            readonly requestType: {
                encode(message: GetLinksRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksRequest;
                fromJSON(object: any): GetLinksRequest;
                toJSON(message: GetLinksRequest): unknown;
                create(base?: DeepPartial<GetLinksRequest>): GetLinksRequest;
                fromPartial(object: DeepPartial<GetLinksRequest>): GetLinksRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: GetLinksResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetLinksResponse;
                fromJSON(object: any): GetLinksResponse;
                toJSON(message: GetLinksResponse): unknown;
                create(base?: DeepPartial<GetLinksResponse>): GetLinksResponse;
                fromPartial(object: DeepPartial<GetLinksResponse>): GetLinksResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** create a new link */
        readonly createLink: {
            readonly name: "CreateLink";
            readonly requestType: {
                encode(message: CreateLinkRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkRequest;
                fromJSON(object: any): CreateLinkRequest;
                toJSON(message: CreateLinkRequest): unknown;
                create(base?: DeepPartial<CreateLinkRequest>): CreateLinkRequest;
                fromPartial(object: DeepPartial<CreateLinkRequest>): CreateLinkRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: CreateLinkResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CreateLinkResponse;
                fromJSON(object: any): CreateLinkResponse;
                toJSON(message: CreateLinkResponse): unknown;
                create(base?: DeepPartial<CreateLinkResponse>): CreateLinkResponse;
                fromPartial(object: DeepPartial<CreateLinkResponse>): CreateLinkResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** request verification for a link */
        readonly createVerificationRequest: {
            readonly name: "CreateVerificationRequest";
            readonly requestType: {
                encode(message: CreateVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestRequest;
                fromJSON(object: any): CreateVerificationRequestRequest;
                toJSON(message: CreateVerificationRequestRequest): unknown;
                create(base?: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest;
                fromPartial(object: DeepPartial<CreateVerificationRequestRequest>): CreateVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: CreateVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerificationRequestResponse;
                fromJSON(object: any): CreateVerificationRequestResponse;
                toJSON(message: CreateVerificationRequestResponse): unknown;
                create(base?: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse;
                fromPartial(object: DeepPartial<CreateVerificationRequestResponse>): CreateVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** as a claimer, accept a verification request */
        readonly acceptVerificationRequest: {
            readonly name: "AcceptVerificationRequest";
            readonly requestType: {
                encode(message: AcceptVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestRequest;
                fromJSON(object: any): AcceptVerificationRequestRequest;
                toJSON(message: AcceptVerificationRequestRequest): unknown;
                create(base?: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest;
                fromPartial(object: DeepPartial<AcceptVerificationRequestRequest>): AcceptVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: AcceptVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): AcceptVerificationRequestResponse;
                fromJSON(_: any): AcceptVerificationRequestResponse;
                toJSON(_: AcceptVerificationRequestResponse): unknown;
                create(base?: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse;
                fromPartial(_: DeepPartial<AcceptVerificationRequestResponse>): AcceptVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** as a claimer, reject a verification request */
        readonly rejectVerificationRequest: {
            readonly name: "RejectVerificationRequest";
            readonly requestType: {
                encode(message: RejectVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestRequest;
                fromJSON(object: any): RejectVerificationRequestRequest;
                toJSON(message: RejectVerificationRequestRequest): unknown;
                create(base?: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest;
                fromPartial(object: DeepPartial<RejectVerificationRequestRequest>): RejectVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: RejectVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): RejectVerificationRequestResponse;
                fromJSON(_: any): RejectVerificationRequestResponse;
                toJSON(_: RejectVerificationRequestResponse): unknown;
                create(base?: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse;
                fromPartial(_: DeepPartial<RejectVerificationRequestResponse>): RejectVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** as a requestor, mark the verification request as complete */
        readonly succeedVerificationRequest: {
            readonly name: "SucceedVerificationRequest";
            readonly requestType: {
                encode(message: SucceedVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestRequest;
                fromJSON(object: any): SucceedVerificationRequestRequest;
                toJSON(message: SucceedVerificationRequestRequest): unknown;
                create(base?: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest;
                fromPartial(object: DeepPartial<SucceedVerificationRequestRequest>): SucceedVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: SucceedVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): SucceedVerificationRequestResponse;
                fromJSON(_: any): SucceedVerificationRequestResponse;
                toJSON(_: SucceedVerificationRequestResponse): unknown;
                create(base?: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse;
                fromPartial(_: DeepPartial<SucceedVerificationRequestResponse>): SucceedVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /**
         * as a requestor, mark the verification request as failed;
         * invalid proof submitted by the claimer
         */
        readonly failVerificationRequest: {
            readonly name: "FailVerificationRequest";
            readonly requestType: {
                encode(message: FailVerificationRequestRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestRequest;
                fromJSON(object: any): FailVerificationRequestRequest;
                toJSON(message: FailVerificationRequestRequest): unknown;
                create(base?: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest;
                fromPartial(object: DeepPartial<FailVerificationRequestRequest>): FailVerificationRequestRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: FailVerificationRequestResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): FailVerificationRequestResponse;
                fromJSON(_: any): FailVerificationRequestResponse;
                toJSON(_: FailVerificationRequestResponse): unknown;
                create(base?: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse;
                fromPartial(_: DeepPartial<FailVerificationRequestResponse>): FailVerificationRequestResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** get verification requests */
        readonly getVerificationRequests: {
            readonly name: "GetVerificationRequests";
            readonly requestType: {
                encode(message: GetVerificationRequestsRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsRequest;
                fromJSON(object: any): GetVerificationRequestsRequest;
                toJSON(message: GetVerificationRequestsRequest): unknown;
                create(base?: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest;
                fromPartial(object: DeepPartial<GetVerificationRequestsRequest>): GetVerificationRequestsRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: GetVerificationRequestsResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetVerificationRequestsResponse;
                fromJSON(object: any): GetVerificationRequestsResponse;
                toJSON(message: GetVerificationRequestsResponse): unknown;
                create(base?: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse;
                fromPartial(object: DeepPartial<GetVerificationRequestsResponse>): GetVerificationRequestsResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** update your own user */
        readonly updateUser: {
            readonly name: "UpdateUser";
            readonly requestType: {
                encode(message: UpdateUserRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserRequest;
                fromJSON(object: any): UpdateUserRequest;
                toJSON(message: UpdateUserRequest): unknown;
                create(base?: DeepPartial<UpdateUserRequest>): UpdateUserRequest;
                fromPartial(object: DeepPartial<UpdateUserRequest>): UpdateUserRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: UpdateUserResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUserResponse;
                fromJSON(_: any): UpdateUserResponse;
                toJSON(_: UpdateUserResponse): unknown;
                create(base?: DeepPartial<UpdateUserResponse>): UpdateUserResponse;
                fromPartial(_: DeepPartial<UpdateUserResponse>): UpdateUserResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /**
         * start claim creation, sponsored by QB
         * Note: this RPC must be authorised by the wallet
         * that is going to create the claim
         */
        readonly startClaimCreation: {
            readonly name: "StartClaimCreation";
            readonly requestType: {
                encode(message: StartClaimCreationRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationRequest;
                fromJSON(object: any): StartClaimCreationRequest;
                toJSON(message: StartClaimCreationRequest): unknown;
                create(base?: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest;
                fromPartial(object: DeepPartial<StartClaimCreationRequest>): StartClaimCreationRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: StartClaimCreationResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): StartClaimCreationResponse;
                fromJSON(object: any): StartClaimCreationResponse;
                toJSON(message: StartClaimCreationResponse): unknown;
                create(base?: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse;
                fromPartial(object: DeepPartial<StartClaimCreationResponse>): StartClaimCreationResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
    };
};
export interface ReclaimBackendServiceImplementation<CallContextExt = {}> {
    /** Get metadata (including wallet address) about the service */
    getServiceMetadata(request: GetServiceMetadataRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetServiceMetadataResponse>>;
    /** get links created by the user */
    getLinks(request: GetLinksRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetLinksResponse>>;
    /** create a new link */
    createLink(request: CreateLinkRequest, context: CallContext & CallContextExt): Promise<DeepPartial<CreateLinkResponse>>;
    /** request verification for a link */
    createVerificationRequest(request: CreateVerificationRequestRequest, context: CallContext & CallContextExt): Promise<DeepPartial<CreateVerificationRequestResponse>>;
    /** as a claimer, accept a verification request */
    acceptVerificationRequest(request: AcceptVerificationRequestRequest, context: CallContext & CallContextExt): Promise<DeepPartial<AcceptVerificationRequestResponse>>;
    /** as a claimer, reject a verification request */
    rejectVerificationRequest(request: RejectVerificationRequestRequest, context: CallContext & CallContextExt): Promise<DeepPartial<RejectVerificationRequestResponse>>;
    /** as a requestor, mark the verification request as complete */
    succeedVerificationRequest(request: SucceedVerificationRequestRequest, context: CallContext & CallContextExt): Promise<DeepPartial<SucceedVerificationRequestResponse>>;
    /**
     * as a requestor, mark the verification request as failed;
     * invalid proof submitted by the claimer
     */
    failVerificationRequest(request: FailVerificationRequestRequest, context: CallContext & CallContextExt): Promise<DeepPartial<FailVerificationRequestResponse>>;
    /** get verification requests */
    getVerificationRequests(request: GetVerificationRequestsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetVerificationRequestsResponse>>;
    /** update your own user */
    updateUser(request: UpdateUserRequest, context: CallContext & CallContextExt): Promise<DeepPartial<UpdateUserResponse>>;
    /**
     * start claim creation, sponsored by QB
     * Note: this RPC must be authorised by the wallet
     * that is going to create the claim
     */
    startClaimCreation(request: StartClaimCreationRequest, context: CallContext & CallContextExt): Promise<DeepPartial<StartClaimCreationResponse>>;
}
export interface ReclaimBackendClient<CallOptionsExt = {}> {
    /** Get metadata (including wallet address) about the service */
    getServiceMetadata(request: DeepPartial<GetServiceMetadataRequest>, options?: CallOptions & CallOptionsExt): Promise<GetServiceMetadataResponse>;
    /** get links created by the user */
    getLinks(request: DeepPartial<GetLinksRequest>, options?: CallOptions & CallOptionsExt): Promise<GetLinksResponse>;
    /** create a new link */
    createLink(request: DeepPartial<CreateLinkRequest>, options?: CallOptions & CallOptionsExt): Promise<CreateLinkResponse>;
    /** request verification for a link */
    createVerificationRequest(request: DeepPartial<CreateVerificationRequestRequest>, options?: CallOptions & CallOptionsExt): Promise<CreateVerificationRequestResponse>;
    /** as a claimer, accept a verification request */
    acceptVerificationRequest(request: DeepPartial<AcceptVerificationRequestRequest>, options?: CallOptions & CallOptionsExt): Promise<AcceptVerificationRequestResponse>;
    /** as a claimer, reject a verification request */
    rejectVerificationRequest(request: DeepPartial<RejectVerificationRequestRequest>, options?: CallOptions & CallOptionsExt): Promise<RejectVerificationRequestResponse>;
    /** as a requestor, mark the verification request as complete */
    succeedVerificationRequest(request: DeepPartial<SucceedVerificationRequestRequest>, options?: CallOptions & CallOptionsExt): Promise<SucceedVerificationRequestResponse>;
    /**
     * as a requestor, mark the verification request as failed;
     * invalid proof submitted by the claimer
     */
    failVerificationRequest(request: DeepPartial<FailVerificationRequestRequest>, options?: CallOptions & CallOptionsExt): Promise<FailVerificationRequestResponse>;
    /** get verification requests */
    getVerificationRequests(request: DeepPartial<GetVerificationRequestsRequest>, options?: CallOptions & CallOptionsExt): Promise<GetVerificationRequestsResponse>;
    /** update your own user */
    updateUser(request: DeepPartial<UpdateUserRequest>, options?: CallOptions & CallOptionsExt): Promise<UpdateUserResponse>;
    /**
     * start claim creation, sponsored by QB
     * Note: this RPC must be authorised by the wallet
     * that is going to create the claim
     */
    startClaimCreation(request: DeepPartial<StartClaimCreationRequest>, options?: CallOptions & CallOptionsExt): Promise<StartClaimCreationResponse>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
