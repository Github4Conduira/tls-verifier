/// <reference types="node" />
export declare const LEGACY_PROTOCOL_VERSION: Buffer;
export declare const CURRENT_PROTOCOL_VERSION: Buffer;
export declare const COMPRESSION_MODE: Buffer;
export declare const SUPPORTED_KEY_TYPE_MAP: {
    X25519: Buffer;
};
export declare const SUPPORTED_RECORD_TYPE_MAP: {
    CLIENT_HELLO: number;
    SERVER_HELLO: number;
    SESSION_TICKET: number;
    ENCRYPTED_EXTENSIONS: number;
    CERTIFICATE: number;
    CERTIFICATE_REQUEST: number;
    CERTIFICATE_VERIFY: number;
    FINISHED: number;
    KEY_UPDATE: number;
};
export declare const CONTENT_TYPE_MAP: {
    CHANGE_CIPHER_SPEC: number;
    ALERT: number;
    HANDSHAKE: number;
    APPLICATION_DATA: number;
};
export declare const AUTH_TAG_BYTE_LENGTH = 16;
export declare const SUPPORTED_KEY_TYPES: "X25519"[];
export declare const SUPPORTED_CIPHER_SUITE_MAP: {
    readonly TLS_CHACHA20_POLY1305_SHA256: {
        readonly identifier: Buffer;
        readonly keyLength: 32;
        readonly hashLength: 32;
        readonly hashAlgorithm: "sha256";
        readonly cipher: "chacha20-poly1305";
    };
    readonly TLS_AES_256_GCM_SHA384: {
        readonly identifier: Buffer;
        readonly keyLength: 32;
        readonly hashLength: 48;
        readonly hashAlgorithm: "sha384";
        readonly cipher: "aes-256-gcm";
    };
    readonly TLS_AES_128_GCM_SHA256: {
        readonly identifier: Buffer;
        readonly keyLength: 16;
        readonly hashLength: 32;
        readonly hashAlgorithm: "sha256";
        readonly cipher: "aes-128-gcm";
    };
};
export declare const SUPPORTED_CIPHER_SUITES_ID_MAP: {
    TLS_AES_128_GCM_SHA256: string;
    TLS_AES_256_GCM_SHA384: string;
    TLS_CHACHA20_POLY1305_SHA256: string;
};
export declare const ALERT_LEVEL: {
    WARNING: number;
    FATAL: number;
};
export declare const ALERT_DESCRIPTION: {
    CLOSE_NOTIFY: number;
    UNEXPECTED_MESSAGE: number;
    BAD_RECORD_MAC: number;
    RECORD_OVERFLOW: number;
    HANDSHAKE_FAILURE: number;
    BAD_CERTIFICATE: number;
    UNSUPPORTED_CERTIFICATE: number;
    CERTIFICATE_REVOKED: number;
    CERTIFICATE_EXPIRED: number;
    CERTIFICATE_UNKNOWN: number;
    ILLEGAL_PARAMETER: number;
    UNKNOWN_CA: number;
    ACCESS_DENIED: number;
    DECODE_ERROR: number;
    DECRYPT_ERROR: number;
    PROTOCOL_VERSION: number;
    INSUFFICIENT_SECURITY: number;
    INTERNAL_ERROR: number;
    INAPPROPRIATE_FALLBACK: number;
    USER_CANCELED: number;
    MISSING_EXTENSION: number;
    UNSUPPORTED_EXTENSION: number;
    UNRECOGNIZED_NAME: number;
    BAD_CERTIFICATE_STATUS_RESPONSE: number;
    UNKNOWN_PSK_IDENTITY: number;
    CERTIFICATE_REQUIRED: number;
    NO_APPLICATION_PROTOCOL: number;
};
export declare const SUPPORTED_CIPHER_SUITES: ("TLS_CHACHA20_POLY1305_SHA256" | "TLS_AES_256_GCM_SHA384" | "TLS_AES_128_GCM_SHA256")[];
type SignatureAlgType = 'RSA_PSS_RSAE_SHA256' | 'ED25519' | 'RSA_PKCS1_SHA512';
type SupportedSignatureAlg = {
    identifier: Buffer;
    verify(data: Buffer, signature: Buffer, publicKey: Buffer | string): boolean;
};
export declare const SUPPORTED_SIGNATURE_ALGS_MAP: {
    [K in SignatureAlgType]: SupportedSignatureAlg;
};
export declare const SUPPORTED_SIGNATURE_ALGS: SignatureAlgType[];
export declare const SUPPORTED_EXTENSION_MAP: {
    SERVER_NAME: number;
    KEY_SHARE: number;
    SUPPORTED_GROUPS: number;
    SIGNATURE_ALGS: number;
    SUPPORTED_VERSIONS: number;
    SESSION_TICKET: number;
    EARLY_DATA: number;
    PRE_SHARED_KEY: number;
    PRE_SHARED_KEY_MODE: number;
};
export declare const SUPPORTED_EXTENSIONS: ("SERVER_NAME" | "KEY_SHARE" | "SUPPORTED_GROUPS" | "SIGNATURE_ALGS" | "SUPPORTED_VERSIONS" | "SESSION_TICKET" | "EARLY_DATA" | "PRE_SHARED_KEY" | "PRE_SHARED_KEY_MODE")[];
export declare const PACKET_TYPE: {
    HELLO: number;
    WRAPPED_RECORD: number;
    CHANGE_CIPHER_SPEC: number;
    ALERT: number;
};
export declare const KEY_UPDATE_TYPE_MAP: {
    UPDATE_NOT_REQUESTED: number;
    UPDATE_REQUESTED: number;
};
export {};
