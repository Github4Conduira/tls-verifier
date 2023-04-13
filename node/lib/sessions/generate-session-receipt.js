"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionReceipt = void 0;
const reclaim_zk_1 = require("@questbook/reclaim-zk");
const config_1 = require("../config");
const api_1 = require("../proto/api");
const signatures_1 = require("../signatures");
const wrapped_record_1 = require("../tls/wrapped-record");
const utils_1 = require("../utils");
const zk_1 = require("../utils/zk");
const params = (0, reclaim_zk_1.loadZKParamsLocally)();
async function generateSessionReceipt(session, cipherSuiteType, logger) {
    const cipherSuite = getCipherSuite();
    const mappedTranscript = await Promise.all(session.transcript.map(async ({ sender, packet, zkReveal, directReveal, }) => {
        var _a, _b, _c;
        let redacted = !!packet.authenticationTag;
        let plaintext = new Uint8Array();
        if (!((_a = packet === null || packet === void 0 ? void 0 : packet.authenticationTag) === null || _a === void 0 ? void 0 : _a.length)) {
            redacted = false;
            plaintext = packet.content;
        }
        else if ((_b = directReveal === null || directReveal === void 0 ? void 0 : directReveal.key) === null || _b === void 0 ? void 0 : _b.length) {
            const { key, iv } = directReveal;
            const result = (0, wrapped_record_1.decryptWrappedRecord)(packet.content, {
                authTag: packet.authenticationTag,
                iv,
                key,
                recordHeader: packet.recordHeader,
                recordNumber: undefined,
                cipherSuite,
            });
            redacted = false;
            plaintext = result.plaintext;
        }
        else if ((_c = zkReveal === null || zkReveal === void 0 ? void 0 : zkReveal.proofs) === null || _c === void 0 ? void 0 : _c.length) {
            const result = await (0, zk_1.verifyZKBlock)({
                ciphertext: packet.content,
                zkReveal,
                params,
                logger,
            });
            plaintext = result.redactedPlaintext;
            redacted = false;
        }
        return {
            senderType: sender === 'client'
                ? api_1.TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT
                : api_1.TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER,
            redacted,
            message: plaintext,
        };
    }));
    const receipt = {
        hostPort: `${session.host}:${session.port}`,
        transcript: mappedTranscript,
        timestampS: (0, utils_1.unixTimestampSeconds)(),
        signature: new Uint8Array(),
    };
    const receiptBytes = api_1.TLSReceipt.encode(receipt).finish();
    receipt.signature = await signatures_1.SelectedServiceSignature.sign(receiptBytes, config_1.PRIVATE_KEY);
    return receipt;
    function getCipherSuite() {
        var _a, _b;
        if (cipherSuiteType) {
            switch (cipherSuiteType) {
                case api_1.TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256:
                    return 'TLS_CHACHA20_POLY1305_SHA256';
                case api_1.TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256:
                    return 'TLS_AES_128_GCM_SHA256';
                case api_1.TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384:
                    return 'TLS_AES_256_GCM_SHA384';
                default:
                    throw new Error(`Unsupported cipher suite type: ${cipherSuite}`);
            }
        }
        const key = (_b = (_a = session.transcript
            .find(t => { var _a; return (_a = t.directReveal) === null || _a === void 0 ? void 0 : _a.key; })) === null || _a === void 0 ? void 0 : _a.directReveal) === null || _b === void 0 ? void 0 : _b.key;
        return (key === null || key === void 0 ? void 0 : key.length) === 16
            ? 'TLS_AES_128_GCM_SHA256'
            : 'TLS_AES_256_GCM_SHA384';
    }
}
exports.generateSessionReceipt = generateSessionReceipt;
