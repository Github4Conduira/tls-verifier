"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyZKBlock = exports.prepareZkProofs = void 0;
const reclaim_zk_1 = require("@questbook/reclaim-zk");
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const config_1 = require("../config");
const logger_1 = __importDefault(require("./logger"));
const redactions_1 = require("./redactions");
const CHACHA_BLOCK_SIZE = 64;
/**
 * Generate ZK proofs for the given blocks with a redaction function.
 */
async function prepareZkProofs({ blocks, params, redact, logger }) {
    logger = logger || logger_1.default.child({ module: 'zk' });
    const blocksToReveal = (0, redactions_1.getBlocksToReveal)(blocks, redact);
    if (blocksToReveal === 'all') {
        return 'all';
    }
    logger.info({ len: blocksToReveal.length }, 'preparing proofs for blocks');
    let totalChunks = 0;
    const zkBlocks = blocksToReveal.map((block) => {
        const chunks = getBlockWithIvCounter(block.redactedPlaintext);
        totalChunks += chunks.length;
        return {
            block: block.block,
            zkChunks: chunks,
            redactedPlaintext: block.redactedPlaintext
        };
    });
    if (totalChunks > config_1.MAX_ZK_CHUNKS) {
        throw new Error(`Too many chunks to prove: ${totalChunks} > ${config_1.MAX_ZK_CHUNKS}`);
    }
    logger.info({ totalChunks }, 'extracted chunks');
    await Promise.all(zkBlocks.map(async ({ block, zkChunks }) => {
        block.zkReveal = {
            proofs: await Promise.all(zkChunks.map(async ({ chunk, counter }) => {
                const startIdx = (counter - 1) * CHACHA_BLOCK_SIZE;
                const endIdx = counter * CHACHA_BLOCK_SIZE;
                const ciphertextChunk = block.ciphertext.slice(startIdx, endIdx);
                const [proof] = await (0, reclaim_zk_1.generateProof)({
                    key: block.directReveal.key,
                    iv: block.directReveal.iv,
                    startCounter: counter,
                }, {
                    redactedPlaintext: chunk,
                    ciphertext: ciphertextChunk
                }, params);
                logger === null || logger === void 0 ? void 0 : logger.debug({ startIdx, endIdx }, 'generated proof for chunk');
                return {
                    proofJson: proof.proofJson,
                    decryptedRedactedCiphertext: (0, reclaim_zk_1.toUint8Array)(proof.decryptedRedactedCiphertext),
                    redactedPlaintext: chunk,
                    startIdx,
                };
            }))
        };
        delete block.directReveal;
        return block;
    }));
    return zkBlocks;
}
exports.prepareZkProofs = prepareZkProofs;
/**
 * Verify the given ZK proof
 */
async function verifyZKBlock({ ciphertext, zkReveal, params, logger }) {
    if (!zkReveal) {
        throw new Error('No ZK reveal');
    }
    const { proofs } = zkReveal;
    /**
     * to verify if the user has given us the correct redacted plaintext,
     * and isn't providing plaintext that they haven't proven they have
     * we start with a fully redacted plaintext, and then replace the
     * redacted parts with the plaintext that the user has provided
     * in the proofs
     */
    const realRedactedPlaintext = Buffer.alloc(ciphertext.length, reclaim_crypto_sdk_1.REDACTION_CHAR_CODE);
    await Promise.all(proofs.map(async ({ proofJson, decryptedRedactedCiphertext, redactedPlaintext, startIdx, }) => {
        // get the ciphertext chunk we received from the server
        // the ZK library, will verify that the decrypted redacted
        // ciphertext matches the ciphertext received from the server
        const ciphertextChunk = ciphertext.slice(startIdx, startIdx + redactedPlaintext.length);
        await (0, reclaim_zk_1.verifyProof)([
            {
                proofJson,
                decryptedRedactedCiphertext: (0, reclaim_zk_1.toUintArray)(decryptedRedactedCiphertext),
            }
        ], {
            redactedPlaintext,
            ciphertext: ciphertextChunk,
        }, params.zkey);
        logger === null || logger === void 0 ? void 0 : logger.debug({ startIdx, endIdx: startIdx + redactedPlaintext.length }, 'verified proof');
        realRedactedPlaintext.set(redactedPlaintext, startIdx);
    }));
    return {
        redactedPlaintext: realRedactedPlaintext,
    };
}
exports.verifyZKBlock = verifyZKBlock;
/**
 * Split the redacted plaintext into chacha-sized chunks,
 * and set a counter for each chunk.
 *
 * It will only return blocks that are fully or partially revealed
 * @param redactedPlaintext the redacted plaintext that need be split
 */
function getBlockWithIvCounter(redactedPlaintext, blockSize = CHACHA_BLOCK_SIZE) {
    const chunks = chunkBuffer(redactedPlaintext, blockSize);
    const chunksWithCounter = [];
    for (let i = 0; i < chunks.length; i++) {
        if (!(0, reclaim_crypto_sdk_1.isFullyRedacted)(chunks[i])) {
            chunksWithCounter.push({
                chunk: chunks[i],
                counter: i + 1,
            });
        }
    }
    return chunksWithCounter;
}
function chunkBuffer(buffer, chunkSize) {
    const chunks = [];
    for (let i = 0; i < buffer.length; i += chunkSize) {
        chunks.push(buffer.slice(i, i + chunkSize));
    }
    return chunks;
}
