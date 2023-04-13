/// <reference types="node" />
import { SUPPORTED_CIPHER_SUITE_MAP } from '../tls/constants';
import { TLSCrypto } from '../types';
type DeriveTrafficKeysOptions = {
    masterSecret: Buffer;
    /** used to derive keys when resuming session */
    earlySecret?: Buffer;
    cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP;
    /** list of handshake message to hash; or the hash itself */
    hellos: Buffer[] | Buffer;
    /** type of secret; handshake or provider-data */
    secretType: 'hs' | 'ap';
};
export declare const NODEJS_TLS_CRYPTO: TLSCrypto;
export type SharedKeyData = ReturnType<typeof computeSharedKeys>;
export declare function computeSharedMasterKey(clientPrivateKey: Buffer, serverPublicKey: Buffer): Buffer;
export declare function computeUpdatedTrafficMasterSecret(masterSecret: Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP): Buffer;
export declare function computeSharedKeys({ hellos, masterSecret: masterKey, cipherSuite, secretType, earlySecret }: DeriveTrafficKeysOptions): {
    masterSecret: Buffer;
    clientSecret: Buffer;
    serverSecret: Buffer;
    clientEncKey: Buffer;
    serverEncKey: Buffer;
    clientIv: Buffer;
    serverIv: Buffer;
};
export declare function deriveTrafficKeys({ masterSecret, cipherSuite, hellos, secretType, }: DeriveTrafficKeysOptions): {
    masterSecret: Buffer;
    clientSecret: Buffer;
    serverSecret: Buffer;
    clientEncKey: Buffer;
    serverEncKey: Buffer;
    clientIv: Buffer;
    serverIv: Buffer;
};
export declare function deriveTrafficKeysForSide(masterSecret: Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP): {
    masterSecret: Buffer;
    encKey: Buffer;
    iv: Buffer;
};
export declare function hkdfExtractAndExpandLabel(algorithm: string, key: ArrayBufferLike, label: string, context: ArrayBufferLike, length: number): Buffer;
export declare function getHash(msgs: Buffer[] | Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP): Buffer;
export {};
