"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocksToReveal = void 0;
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
/**
 * Given some plaintext blocks and a redaction function, return the blocks that
 * need to be revealed to the other party
 *
 * Use case: we get the response for a request in several blocks, and want to redact
 * pieces that go through multiple blocks. We can use this function to get the
 * blocks that need to be revealed to the other party
 *
 * @example if we received ["secret is 12","345","678. Thanks"]. We'd want
 * to redact the "12345678" and reveal the rest. We'd pass in the blocks and
 * the redact function will return the redactions, namely [10,19].
 * The function will return the blocks ["secret is **","***. Thanks"].
 * The middle block is fully redacted, so it's not returned
 *
 * @param blocks blocks to reveal
 * @param redact function that returns the redactions
 * @returns blocks to reveal
 */
function getBlocksToReveal(blocks, redact) {
    const slicesWithReveal = blocks.map(block => ({
        block,
        redactedPlaintext: Buffer.from(block.plaintext)
    }));
    const total = Buffer.concat(blocks.map(b => b.plaintext));
    const redactions = redact(total);
    if (!redactions.length) {
        return 'all';
    }
    let blockIdx = 0;
    let cursorInBlock = 0;
    let cursor = 0;
    for (const redaction of redactions) {
        redactBlocks(redaction);
    }
    // only reveal blocks that have some data to reveal,
    // or are completely plaintext
    return slicesWithReveal
        .filter(s => !(0, reclaim_crypto_sdk_1.isFullyRedacted)(s.redactedPlaintext));
    function redactBlocks(slice) {
        while (cursor < slice.fromIndex) {
            advance();
        }
        while (cursor < slice.toIndex) {
            slicesWithReveal[blockIdx]
                .redactedPlaintext[cursorInBlock] = reclaim_crypto_sdk_1.REDACTION_CHAR_CODE;
            advance();
        }
    }
    function advance() {
        cursor += 1;
        cursorInBlock += 1;
        if (cursorInBlock >= blocks[blockIdx].plaintext.length) {
            blockIdx += 1;
            cursorInBlock = 0;
        }
    }
}
exports.getBlocksToReveal = getBlocksToReveal;
