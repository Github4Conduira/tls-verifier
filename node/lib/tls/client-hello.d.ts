/// <reference types="node" />
import { TLSPresharedKey } from '../types';
import { SUPPORTED_CIPHER_SUITE_MAP, SUPPORTED_KEY_TYPE_MAP } from './constants';
type SupportedKeyType = keyof typeof SUPPORTED_KEY_TYPE_MAP;
type ClientHelloOptions = {
    host: string;
    publicKey: Buffer;
    publicKeyType?: SupportedKeyType;
    random?: Buffer;
    sessionId?: Buffer;
    psk?: TLSPresharedKey;
    cipherSuites?: (keyof typeof SUPPORTED_CIPHER_SUITE_MAP)[];
};
export declare function packClientHello({ host, sessionId, random, publicKey, publicKeyType, psk, cipherSuites, }: ClientHelloOptions): Buffer;
export declare function computeBinderSuffix(packedHandshakePrefix: Buffer, psk: TLSPresharedKey): Buffer;
/**
 * Packs the preshared key extension; the binder is assumed to be 0
 * The empty binder is suffixed to the end of the extension
 * and should be replaced with the correct binder after the full handshake is computed
 */
export declare function packPresharedKeyExtension({ identity, ticketAge, cipherSuite }: TLSPresharedKey): Buffer;
export {};
