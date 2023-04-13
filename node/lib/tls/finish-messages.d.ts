/// <reference types="node" />
import { SUPPORTED_CIPHER_SUITE_MAP } from './constants';
type VerifyFinishMessageOptions = {
    secret: Buffer;
    handshakeMessages: Buffer[];
    cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP;
};
export declare function verifyFinishMessage(verifyData: Buffer, opts: VerifyFinishMessageOptions): void;
export declare function packFinishMessagePacket(opts: VerifyFinishMessageOptions): Buffer;
export {};
