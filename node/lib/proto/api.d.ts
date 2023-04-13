import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "reclaim_witness";
export declare enum TranscriptMessageSenderType {
    TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN = 0,
    TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT = 1,
    TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER = 2,
    UNRECOGNIZED = -1
}
export declare function transcriptMessageSenderTypeFromJSON(object: any): TranscriptMessageSenderType;
export declare function transcriptMessageSenderTypeToJSON(object: TranscriptMessageSenderType): string;
export declare enum TlsCipherSuiteType {
    TLS_CIPHER_SUITE_TYPE_UNKNOWN = 0,
    TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256 = 1,
    TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384 = 2,
    TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256 = 3,
    UNRECOGNIZED = -1
}
export declare function tlsCipherSuiteTypeFromJSON(object: any): TlsCipherSuiteType;
export declare function tlsCipherSuiteTypeToJSON(object: TlsCipherSuiteType): string;
export declare enum ServiceSignatureType {
    SERVICE_SIGNATURE_TYPE_UNKNOWN = 0,
    /**
     * SERVICE_SIGNATURE_TYPE_ETH - ETH keys & signature
     * keys: secp256k1
     * signature: ethereum flavor of ECDSA (https://goethereumbook.org/signature-generate/)
     */
    SERVICE_SIGNATURE_TYPE_ETH = 1,
    UNRECOGNIZED = -1
}
export declare function serviceSignatureTypeFromJSON(object: any): ServiceSignatureType;
export declare function serviceSignatureTypeToJSON(object: ServiceSignatureType): string;
export interface TLSPacket {
    recordHeader: Uint8Array;
    content: Uint8Array;
    authenticationTag: Uint8Array;
}
export interface TranscriptMessage {
    senderType: TranscriptMessageSenderType;
    redacted: boolean;
    /** if redacted, message is empty */
    message: Uint8Array;
}
export interface ProviderClaimData {
    provider: string;
    parameters: string;
    owner: string;
    timestampS: number;
    claimId: number;
    context: string;
}
export interface ProviderClaimInfo {
    provider: string;
    parameters: string;
    context: string;
}
export interface TLSReceipt {
    /**
     * host concatenated with port with a colon (:)
     * eg. localhost:443
     */
    hostPort: string;
    /** unix timestamp in seconds of the receipt completion */
    timestampS: number;
    /**
     * the transcript between the server & client
     * in the order they were received
     */
    transcript: TranscriptMessage[];
    /** sign(proto(TLSReceipt w/o signature)) */
    signature: Uint8Array;
}
export interface GetVerifierPublicKeyRequest {
}
export interface GetVerifierPublicKeyResponse {
    /** public key of the verifier */
    publicKey: Uint8Array;
    /** type of signature being used by the service */
    signatureType: ServiceSignatureType;
}
export interface InitialiseSessionRequest {
    /**
     * Use if you'd just like a signed receipt
     * for some custom purpose
     */
    receiptGenerationRequest: InitialiseSessionRequest_ReceiptGenerationRequest | undefined;
    /** Use if you'd like to claim an provider credential */
    providerClaimRequest: InitialiseSessionRequest_ProviderClaimRequest | undefined;
}
export interface InitialiseSessionRequest_ReceiptGenerationRequest {
    host: string;
    port: number;
}
export interface InitialiseSessionRequest_ProviderClaimRequest {
    /** The chain ID on which the request was generated */
    chainId: number;
    /** ID of the claim on the smart contract */
    claimId: number;
    /** private information to sign */
    info: ProviderClaimInfo | undefined;
}
export interface InitialiseSessionResponse {
    /** opaque ID assigned to the client for this request */
    sessionId: string;
}
export interface PushToSessionRequest {
    /** opaque ID assigned to the client for this request */
    sessionId: string;
    /** messages to push */
    messages: TLSPacket[];
}
/** empty response */
export interface PushToSessionResponse {
}
export interface PullFromSessionRequest {
    /** opaque ID assigned to the client for this request */
    sessionId: string;
}
export interface PullFromSessionResponse {
    /** messages pulled from the server */
    message: TLSPacket | undefined;
}
export interface CancelSessionRequest {
    sessionId: string;
}
/** empty response */
export interface CancelSessionResponse {
}
export interface FinaliseSessionRequest {
    sessionId: string;
    revealBlocks: FinaliseSessionRequest_Block[];
    cipherSuite: TlsCipherSuiteType;
}
export interface FinaliseSessionRequest_Block {
    /** auth tag of the block to reveal */
    authTag: Uint8Array;
    /**
     * key & IV for direct reveal;
     * kept for backwards compatibility
     */
    key: Uint8Array;
    iv: Uint8Array;
    directReveal: FinaliseSessionRequest_BlockRevealDirect | undefined;
    zkReveal: FinaliseSessionRequest_BlockRevealZk | undefined;
}
/**
 * direct reveal of the block via the key & IV
 * cipher (aes, chacha) for decryption
 * selected based on `cipherSuite`
 * in `FinaliseSessionRequest`
 */
export interface FinaliseSessionRequest_BlockRevealDirect {
    /** key for the block */
    key: Uint8Array;
    /** IV for the block */
    iv: Uint8Array;
}
/** partially or fully reveal the block via a zk proof */
export interface FinaliseSessionRequest_BlockRevealZk {
    proofs: FinaliseSessionRequest_ZKProof[];
}
export interface FinaliseSessionRequest_ZKProof {
    /** JSON encoded snarkJS proof */
    proofJson: string;
    /** the decrypted ciphertext as output by the ZK proof */
    decryptedRedactedCiphertext: Uint8Array;
    /** the plaintext that is fully or partially revealed */
    redactedPlaintext: Uint8Array;
    /**
     * start of this specific ChaCha block
     * in the redactedPlaintext
     */
    startIdx: number;
}
export interface FinaliseSessionResponse {
    receipt: TLSReceipt | undefined;
    claimData: ProviderClaimData | undefined;
    /** signature of `stringifyProviderClaimData(claimData)` */
    signature: Uint8Array;
}
export declare const TLSPacket: {
    encode(message: TLSPacket, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TLSPacket;
    fromJSON(object: any): TLSPacket;
    toJSON(message: TLSPacket): unknown;
    create(base?: DeepPartial<TLSPacket>): TLSPacket;
    fromPartial(object: DeepPartial<TLSPacket>): TLSPacket;
};
export declare const TranscriptMessage: {
    encode(message: TranscriptMessage, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TranscriptMessage;
    fromJSON(object: any): TranscriptMessage;
    toJSON(message: TranscriptMessage): unknown;
    create(base?: DeepPartial<TranscriptMessage>): TranscriptMessage;
    fromPartial(object: DeepPartial<TranscriptMessage>): TranscriptMessage;
};
export declare const ProviderClaimData: {
    encode(message: ProviderClaimData, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ProviderClaimData;
    fromJSON(object: any): ProviderClaimData;
    toJSON(message: ProviderClaimData): unknown;
    create(base?: DeepPartial<ProviderClaimData>): ProviderClaimData;
    fromPartial(object: DeepPartial<ProviderClaimData>): ProviderClaimData;
};
export declare const ProviderClaimInfo: {
    encode(message: ProviderClaimInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ProviderClaimInfo;
    fromJSON(object: any): ProviderClaimInfo;
    toJSON(message: ProviderClaimInfo): unknown;
    create(base?: DeepPartial<ProviderClaimInfo>): ProviderClaimInfo;
    fromPartial(object: DeepPartial<ProviderClaimInfo>): ProviderClaimInfo;
};
export declare const TLSReceipt: {
    encode(message: TLSReceipt, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TLSReceipt;
    fromJSON(object: any): TLSReceipt;
    toJSON(message: TLSReceipt): unknown;
    create(base?: DeepPartial<TLSReceipt>): TLSReceipt;
    fromPartial(object: DeepPartial<TLSReceipt>): TLSReceipt;
};
export declare const GetVerifierPublicKeyRequest: {
    encode(_: GetVerifierPublicKeyRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVerifierPublicKeyRequest;
    fromJSON(_: any): GetVerifierPublicKeyRequest;
    toJSON(_: GetVerifierPublicKeyRequest): unknown;
    create(base?: DeepPartial<GetVerifierPublicKeyRequest>): GetVerifierPublicKeyRequest;
    fromPartial(_: DeepPartial<GetVerifierPublicKeyRequest>): GetVerifierPublicKeyRequest;
};
export declare const GetVerifierPublicKeyResponse: {
    encode(message: GetVerifierPublicKeyResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVerifierPublicKeyResponse;
    fromJSON(object: any): GetVerifierPublicKeyResponse;
    toJSON(message: GetVerifierPublicKeyResponse): unknown;
    create(base?: DeepPartial<GetVerifierPublicKeyResponse>): GetVerifierPublicKeyResponse;
    fromPartial(object: DeepPartial<GetVerifierPublicKeyResponse>): GetVerifierPublicKeyResponse;
};
export declare const InitialiseSessionRequest: {
    encode(message: InitialiseSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionRequest;
    fromJSON(object: any): InitialiseSessionRequest;
    toJSON(message: InitialiseSessionRequest): unknown;
    create(base?: DeepPartial<InitialiseSessionRequest>): InitialiseSessionRequest;
    fromPartial(object: DeepPartial<InitialiseSessionRequest>): InitialiseSessionRequest;
};
export declare const InitialiseSessionRequest_ReceiptGenerationRequest: {
    encode(message: InitialiseSessionRequest_ReceiptGenerationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionRequest_ReceiptGenerationRequest;
    fromJSON(object: any): InitialiseSessionRequest_ReceiptGenerationRequest;
    toJSON(message: InitialiseSessionRequest_ReceiptGenerationRequest): unknown;
    create(base?: DeepPartial<InitialiseSessionRequest_ReceiptGenerationRequest>): InitialiseSessionRequest_ReceiptGenerationRequest;
    fromPartial(object: DeepPartial<InitialiseSessionRequest_ReceiptGenerationRequest>): InitialiseSessionRequest_ReceiptGenerationRequest;
};
export declare const InitialiseSessionRequest_ProviderClaimRequest: {
    encode(message: InitialiseSessionRequest_ProviderClaimRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionRequest_ProviderClaimRequest;
    fromJSON(object: any): InitialiseSessionRequest_ProviderClaimRequest;
    toJSON(message: InitialiseSessionRequest_ProviderClaimRequest): unknown;
    create(base?: DeepPartial<InitialiseSessionRequest_ProviderClaimRequest>): InitialiseSessionRequest_ProviderClaimRequest;
    fromPartial(object: DeepPartial<InitialiseSessionRequest_ProviderClaimRequest>): InitialiseSessionRequest_ProviderClaimRequest;
};
export declare const InitialiseSessionResponse: {
    encode(message: InitialiseSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionResponse;
    fromJSON(object: any): InitialiseSessionResponse;
    toJSON(message: InitialiseSessionResponse): unknown;
    create(base?: DeepPartial<InitialiseSessionResponse>): InitialiseSessionResponse;
    fromPartial(object: DeepPartial<InitialiseSessionResponse>): InitialiseSessionResponse;
};
export declare const PushToSessionRequest: {
    encode(message: PushToSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PushToSessionRequest;
    fromJSON(object: any): PushToSessionRequest;
    toJSON(message: PushToSessionRequest): unknown;
    create(base?: DeepPartial<PushToSessionRequest>): PushToSessionRequest;
    fromPartial(object: DeepPartial<PushToSessionRequest>): PushToSessionRequest;
};
export declare const PushToSessionResponse: {
    encode(_: PushToSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PushToSessionResponse;
    fromJSON(_: any): PushToSessionResponse;
    toJSON(_: PushToSessionResponse): unknown;
    create(base?: DeepPartial<PushToSessionResponse>): PushToSessionResponse;
    fromPartial(_: DeepPartial<PushToSessionResponse>): PushToSessionResponse;
};
export declare const PullFromSessionRequest: {
    encode(message: PullFromSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PullFromSessionRequest;
    fromJSON(object: any): PullFromSessionRequest;
    toJSON(message: PullFromSessionRequest): unknown;
    create(base?: DeepPartial<PullFromSessionRequest>): PullFromSessionRequest;
    fromPartial(object: DeepPartial<PullFromSessionRequest>): PullFromSessionRequest;
};
export declare const PullFromSessionResponse: {
    encode(message: PullFromSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PullFromSessionResponse;
    fromJSON(object: any): PullFromSessionResponse;
    toJSON(message: PullFromSessionResponse): unknown;
    create(base?: DeepPartial<PullFromSessionResponse>): PullFromSessionResponse;
    fromPartial(object: DeepPartial<PullFromSessionResponse>): PullFromSessionResponse;
};
export declare const CancelSessionRequest: {
    encode(message: CancelSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionRequest;
    fromJSON(object: any): CancelSessionRequest;
    toJSON(message: CancelSessionRequest): unknown;
    create(base?: DeepPartial<CancelSessionRequest>): CancelSessionRequest;
    fromPartial(object: DeepPartial<CancelSessionRequest>): CancelSessionRequest;
};
export declare const CancelSessionResponse: {
    encode(_: CancelSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionResponse;
    fromJSON(_: any): CancelSessionResponse;
    toJSON(_: CancelSessionResponse): unknown;
    create(base?: DeepPartial<CancelSessionResponse>): CancelSessionResponse;
    fromPartial(_: DeepPartial<CancelSessionResponse>): CancelSessionResponse;
};
export declare const FinaliseSessionRequest: {
    encode(message: FinaliseSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest;
    fromJSON(object: any): FinaliseSessionRequest;
    toJSON(message: FinaliseSessionRequest): unknown;
    create(base?: DeepPartial<FinaliseSessionRequest>): FinaliseSessionRequest;
    fromPartial(object: DeepPartial<FinaliseSessionRequest>): FinaliseSessionRequest;
};
export declare const FinaliseSessionRequest_Block: {
    encode(message: FinaliseSessionRequest_Block, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest_Block;
    fromJSON(object: any): FinaliseSessionRequest_Block;
    toJSON(message: FinaliseSessionRequest_Block): unknown;
    create(base?: DeepPartial<FinaliseSessionRequest_Block>): FinaliseSessionRequest_Block;
    fromPartial(object: DeepPartial<FinaliseSessionRequest_Block>): FinaliseSessionRequest_Block;
};
export declare const FinaliseSessionRequest_BlockRevealDirect: {
    encode(message: FinaliseSessionRequest_BlockRevealDirect, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest_BlockRevealDirect;
    fromJSON(object: any): FinaliseSessionRequest_BlockRevealDirect;
    toJSON(message: FinaliseSessionRequest_BlockRevealDirect): unknown;
    create(base?: DeepPartial<FinaliseSessionRequest_BlockRevealDirect>): FinaliseSessionRequest_BlockRevealDirect;
    fromPartial(object: DeepPartial<FinaliseSessionRequest_BlockRevealDirect>): FinaliseSessionRequest_BlockRevealDirect;
};
export declare const FinaliseSessionRequest_BlockRevealZk: {
    encode(message: FinaliseSessionRequest_BlockRevealZk, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest_BlockRevealZk;
    fromJSON(object: any): FinaliseSessionRequest_BlockRevealZk;
    toJSON(message: FinaliseSessionRequest_BlockRevealZk): unknown;
    create(base?: DeepPartial<FinaliseSessionRequest_BlockRevealZk>): FinaliseSessionRequest_BlockRevealZk;
    fromPartial(object: DeepPartial<FinaliseSessionRequest_BlockRevealZk>): FinaliseSessionRequest_BlockRevealZk;
};
export declare const FinaliseSessionRequest_ZKProof: {
    encode(message: FinaliseSessionRequest_ZKProof, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest_ZKProof;
    fromJSON(object: any): FinaliseSessionRequest_ZKProof;
    toJSON(message: FinaliseSessionRequest_ZKProof): unknown;
    create(base?: DeepPartial<FinaliseSessionRequest_ZKProof>): FinaliseSessionRequest_ZKProof;
    fromPartial(object: DeepPartial<FinaliseSessionRequest_ZKProof>): FinaliseSessionRequest_ZKProof;
};
export declare const FinaliseSessionResponse: {
    encode(message: FinaliseSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionResponse;
    fromJSON(object: any): FinaliseSessionResponse;
    toJSON(message: FinaliseSessionResponse): unknown;
    create(base?: DeepPartial<FinaliseSessionResponse>): FinaliseSessionResponse;
    fromPartial(object: DeepPartial<FinaliseSessionResponse>): FinaliseSessionResponse;
};
export type ReclaimWitnessDefinition = typeof ReclaimWitnessDefinition;
export declare const ReclaimWitnessDefinition: {
    readonly name: "ReclaimWitness";
    readonly fullName: "reclaim_witness.ReclaimWitness";
    readonly methods: {
        /** get the x25519 public key of the verifier that can be used to verify authenticity of receipts & credentials */
        readonly getVerifierPublicKey: {
            readonly name: "GetVerifierPublicKey";
            readonly requestType: {
                encode(_: GetVerifierPublicKeyRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetVerifierPublicKeyRequest;
                fromJSON(_: any): GetVerifierPublicKeyRequest;
                toJSON(_: GetVerifierPublicKeyRequest): unknown;
                create(base?: DeepPartial<GetVerifierPublicKeyRequest>): GetVerifierPublicKeyRequest;
                fromPartial(_: DeepPartial<GetVerifierPublicKeyRequest>): GetVerifierPublicKeyRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: GetVerifierPublicKeyResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): GetVerifierPublicKeyResponse;
                fromJSON(object: any): GetVerifierPublicKeyResponse;
                toJSON(message: GetVerifierPublicKeyResponse): unknown;
                create(base?: DeepPartial<GetVerifierPublicKeyResponse>): GetVerifierPublicKeyResponse;
                fromPartial(object: DeepPartial<GetVerifierPublicKeyResponse>): GetVerifierPublicKeyResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** initialise a new TLS verification session with the verifier */
        readonly initialiseSession: {
            readonly name: "initialiseSession";
            readonly requestType: {
                encode(message: InitialiseSessionRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionRequest;
                fromJSON(object: any): InitialiseSessionRequest;
                toJSON(message: InitialiseSessionRequest): unknown;
                create(base?: DeepPartial<InitialiseSessionRequest>): InitialiseSessionRequest;
                fromPartial(object: DeepPartial<InitialiseSessionRequest>): InitialiseSessionRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: InitialiseSessionResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): InitialiseSessionResponse;
                fromJSON(object: any): InitialiseSessionResponse;
                toJSON(message: InitialiseSessionResponse): unknown;
                create(base?: DeepPartial<InitialiseSessionResponse>): InitialiseSessionResponse;
                fromPartial(object: DeepPartial<InitialiseSessionResponse>): InitialiseSessionResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** push blocks to the session */
        readonly pushToSession: {
            readonly name: "PushToSession";
            readonly requestType: {
                encode(message: PushToSessionRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): PushToSessionRequest;
                fromJSON(object: any): PushToSessionRequest;
                toJSON(message: PushToSessionRequest): unknown;
                create(base?: DeepPartial<PushToSessionRequest>): PushToSessionRequest;
                fromPartial(object: DeepPartial<PushToSessionRequest>): PushToSessionRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: PushToSessionResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): PushToSessionResponse;
                fromJSON(_: any): PushToSessionResponse;
                toJSON(_: PushToSessionResponse): unknown;
                create(base?: DeepPartial<PushToSessionResponse>): PushToSessionResponse;
                fromPartial(_: DeepPartial<PushToSessionResponse>): PushToSessionResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** listen to blocks from the session */
        readonly pullFromSession: {
            readonly name: "PullFromSession";
            readonly requestType: {
                encode(message: PullFromSessionRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): PullFromSessionRequest;
                fromJSON(object: any): PullFromSessionRequest;
                toJSON(message: PullFromSessionRequest): unknown;
                create(base?: DeepPartial<PullFromSessionRequest>): PullFromSessionRequest;
                fromPartial(object: DeepPartial<PullFromSessionRequest>): PullFromSessionRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: PullFromSessionResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): PullFromSessionResponse;
                fromJSON(object: any): PullFromSessionResponse;
                toJSON(message: PullFromSessionResponse): unknown;
                create(base?: DeepPartial<PullFromSessionResponse>): PullFromSessionResponse;
                fromPartial(object: DeepPartial<PullFromSessionResponse>): PullFromSessionResponse;
            };
            readonly responseStream: true;
            readonly options: {};
        };
        /** cancel and destroy the session */
        readonly cancelSession: {
            readonly name: "CancelSession";
            readonly requestType: {
                encode(message: CancelSessionRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionRequest;
                fromJSON(object: any): CancelSessionRequest;
                toJSON(message: CancelSessionRequest): unknown;
                create(base?: DeepPartial<CancelSessionRequest>): CancelSessionRequest;
                fromPartial(object: DeepPartial<CancelSessionRequest>): CancelSessionRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(_: CancelSessionResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): CancelSessionResponse;
                fromJSON(_: any): CancelSessionResponse;
                toJSON(_: CancelSessionResponse): unknown;
                create(base?: DeepPartial<CancelSessionResponse>): CancelSessionResponse;
                fromPartial(_: DeepPartial<CancelSessionResponse>): CancelSessionResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
        /** finalise the session, and generate the receipt & provider signature */
        readonly finaliseSession: {
            readonly name: "FinaliseSession";
            readonly requestType: {
                encode(message: FinaliseSessionRequest, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionRequest;
                fromJSON(object: any): FinaliseSessionRequest;
                toJSON(message: FinaliseSessionRequest): unknown;
                create(base?: DeepPartial<FinaliseSessionRequest>): FinaliseSessionRequest;
                fromPartial(object: DeepPartial<FinaliseSessionRequest>): FinaliseSessionRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: FinaliseSessionResponse, writer?: _m0.Writer): _m0.Writer;
                decode(input: _m0.Reader | Uint8Array, length?: number): FinaliseSessionResponse;
                fromJSON(object: any): FinaliseSessionResponse;
                toJSON(message: FinaliseSessionResponse): unknown;
                create(base?: DeepPartial<FinaliseSessionResponse>): FinaliseSessionResponse;
                fromPartial(object: DeepPartial<FinaliseSessionResponse>): FinaliseSessionResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
    };
};
export interface ReclaimWitnessServiceImplementation<CallContextExt = {}> {
    /** get the x25519 public key of the verifier that can be used to verify authenticity of receipts & credentials */
    getVerifierPublicKey(request: GetVerifierPublicKeyRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetVerifierPublicKeyResponse>>;
    /** initialise a new TLS verification session with the verifier */
    initialiseSession(request: InitialiseSessionRequest, context: CallContext & CallContextExt): Promise<DeepPartial<InitialiseSessionResponse>>;
    /** push blocks to the session */
    pushToSession(request: PushToSessionRequest, context: CallContext & CallContextExt): Promise<DeepPartial<PushToSessionResponse>>;
    /** listen to blocks from the session */
    pullFromSession(request: PullFromSessionRequest, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<PullFromSessionResponse>>;
    /** cancel and destroy the session */
    cancelSession(request: CancelSessionRequest, context: CallContext & CallContextExt): Promise<DeepPartial<CancelSessionResponse>>;
    /** finalise the session, and generate the receipt & provider signature */
    finaliseSession(request: FinaliseSessionRequest, context: CallContext & CallContextExt): Promise<DeepPartial<FinaliseSessionResponse>>;
}
export interface ReclaimWitnessClient<CallOptionsExt = {}> {
    /** get the x25519 public key of the verifier that can be used to verify authenticity of receipts & credentials */
    getVerifierPublicKey(request: DeepPartial<GetVerifierPublicKeyRequest>, options?: CallOptions & CallOptionsExt): Promise<GetVerifierPublicKeyResponse>;
    /** initialise a new TLS verification session with the verifier */
    initialiseSession(request: DeepPartial<InitialiseSessionRequest>, options?: CallOptions & CallOptionsExt): Promise<InitialiseSessionResponse>;
    /** push blocks to the session */
    pushToSession(request: DeepPartial<PushToSessionRequest>, options?: CallOptions & CallOptionsExt): Promise<PushToSessionResponse>;
    /** listen to blocks from the session */
    pullFromSession(request: DeepPartial<PullFromSessionRequest>, options?: CallOptions & CallOptionsExt): AsyncIterable<PullFromSessionResponse>;
    /** cancel and destroy the session */
    cancelSession(request: DeepPartial<CancelSessionRequest>, options?: CallOptions & CallOptionsExt): Promise<CancelSessionResponse>;
    /** finalise the session, and generate the receipt & provider signature */
    finaliseSession(request: DeepPartial<FinaliseSessionRequest>, options?: CallOptions & CallOptionsExt): Promise<FinaliseSessionResponse>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export type ServerStreamingMethodResult<Response> = {
    [Symbol.asyncIterator](): AsyncIterator<Response, void>;
};
export {};
