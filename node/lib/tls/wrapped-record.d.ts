/// <reference types="node" />
import { TLSCrypto } from '../types';
import { CONTENT_TYPE_MAP, SUPPORTED_CIPHER_SUITE_MAP } from './constants';
type WrappedRecordCipherOptions = {
    authTag?: Uint8Array;
    iv: Uint8Array;
    key: Uint8Array;
    recordHeader: Uint8Array;
    recordNumber: number | undefined;
    cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP;
    crypto?: TLSCrypto;
};
export declare function decryptWrappedRecord(encryptedData: Uint8Array, { authTag, key, iv, recordHeader, recordNumber, cipherSuite, crypto, }: WrappedRecordCipherOptions): {
    plaintext: Buffer;
    contentType: number;
};
export declare function encryptWrappedRecord({ plaintext, contentType }: {
    plaintext: Buffer;
    contentType: keyof typeof CONTENT_TYPE_MAP;
}, { key, iv, recordHeader, recordNumber, cipherSuite, crypto, }: WrappedRecordCipherOptions): {
    ciphertext: Buffer;
    authTag: Buffer;
};
export declare function parseWrappedRecord(data: Buffer): {
    encryptedData: Buffer;
    authTag: Buffer;
};
export declare function generateIV(iv: Uint8Array, recordNumber: number): Buffer;
export {};
