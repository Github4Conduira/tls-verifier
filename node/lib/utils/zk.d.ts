/// <reference types="node" />
import { ZKParams } from '@questbook/reclaim-zk';
import { Logger } from 'pino';
import { FinaliseSessionRequest_Block as BlockReveal, FinaliseSessionRequest_BlockRevealZk } from '../proto/api';
import { BufferSlice } from '../types/sessions';
type ZKChunk = {
    chunk: Buffer;
    counter: number;
};
type BlockWithPlaintext = Partial<BlockReveal> & {
    ciphertext: Buffer;
    plaintext: Buffer;
};
type ZKBlock = {
    block: BlockWithPlaintext;
    redactedPlaintext: Buffer;
    zkChunks: ZKChunk[];
};
type PrepareZKProofsOpts = {
    /** blocks to prepare ZK proof for */
    blocks: BlockWithPlaintext[];
    /** params for ZK proof gen */
    params: ZKParams;
    /** redact selected portions of the plaintext */
    redact: (plaintext: Buffer) => BufferSlice[];
    logger?: Logger;
};
type ZKVerifyOpts = {
    ciphertext: Uint8Array;
    zkReveal: FinaliseSessionRequest_BlockRevealZk;
    params: ZKParams;
    logger?: Logger;
};
/**
 * Generate ZK proofs for the given blocks with a redaction function.
 */
export declare function prepareZkProofs({ blocks, params, redact, logger }: PrepareZKProofsOpts): Promise<"all" | ZKBlock[]>;
/**
 * Verify the given ZK proof
 */
export declare function verifyZKBlock({ ciphertext, zkReveal, params, logger }: ZKVerifyOpts): Promise<{
    redactedPlaintext: Buffer;
}>;
export {};
