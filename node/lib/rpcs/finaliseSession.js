"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = __importDefault(require("../providers"));
const assert_session_1 = require("../sessions/assert-session");
const generate_session_receipt_1 = require("../sessions/generate-session-receipt");
const generics_1 = require("../utils/generics");
const finaliseSession = async ({ sessionId, revealBlocks, cipherSuite }, { logger }) => {
    const session = (0, assert_session_1.assertSession)(sessionId);
    const claimData = session.attachedData.claim;
    session.socket.end();
    for (const { authTag, directReveal, zkReveal, key, iv } of revealBlocks) {
        const authTagBuffer = Buffer.from(authTag);
        const msg = session.transcript.find(t => (authTagBuffer.equals(t.packet.authenticationTag)));
        if (!msg) {
            throw new generics_1.ServerError(generics_1.Status.INVALID_ARGUMENT, `No matching message found for '${authTagBuffer.toString('hex')}'`);
        }
        if (directReveal === null || directReveal === void 0 ? void 0 : directReveal.key.length) {
            msg.directReveal = directReveal;
        }
        else if (zkReveal === null || zkReveal === void 0 ? void 0 : zkReveal.proofs.length) {
            msg.zkReveal = zkReveal;
        }
        else if (key.length && iv.length) {
            msg.directReveal = {
                key,
                iv
            };
        }
    }
    // generate the signed receipt
    const receipt = await (0, generate_session_receipt_1.generateSessionReceipt)(session, cipherSuite, logger);
    // verify provider claim, if any
    let signature;
    if (claimData) {
        const provider = providers_1.default[claimData.provider];
        try {
            await provider.assertValidProviderReceipt(receipt, JSON.parse(claimData.parameters));
        }
        catch (error) {
            logger.error({ trace: error.stack }, 'receipt generation failed');
            throw new generics_1.ServerError(generics_1.Status.PERMISSION_DENIED, error.message);
        }
        signature = await (0, generics_1.signProviderClaimData)(claimData);
    }
    return {
        receipt,
        claimData,
        signature,
    };
};
exports.default = finaliseSession;
