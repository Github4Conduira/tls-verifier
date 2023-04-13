/// <reference types="node" />
import { ProviderClaimData, TranscriptMessage } from '../proto/api';
import type { X509Certificate } from '../types';
export { ServerError, Status } from 'nice-grpc-common';
/**
 * Converts a buffer to a hex string with whitespace between each byte
 * @returns eg. '01 02 03 04'
 */
export declare function toHexStringWithWhitespace(buff: Buffer): string;
/**
 * converts a space separated hex string to a buffer
 * @param txt eg. '01 02 03 04'
 */
export declare function bufferFromHexStringWithWhitespace(txt: string): Buffer;
export declare function xor(a: Uint8Array, b: Uint8Array): Buffer;
export declare function getTranscriptString(transcript: TranscriptMessage[]): string;
export declare const unixTimestampSeconds: () => number;
export declare function signProviderClaimData(data: ProviderClaimData): Promise<Uint8Array>;
/**
 * Loads all .pem certificates in the given folder
 * @param path folder to load certificates from
 */
export declare function loadRootCAsInFolder(path: string): Promise<X509Certificate<any>[]>;
