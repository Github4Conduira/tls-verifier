"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packFinishMessagePacket = exports.verifyFinishMessage = void 0;
const crypto_1 = require("crypto");
const decryption_utils_1 = require("../utils/decryption-utils");
const constants_1 = require("./constants");
const packets_1 = require("./packets");
function verifyFinishMessage(verifyData, opts) {
    const computedData = computeFinishMessageHash(opts);
    if (!computedData.equals(verifyData)) {
        throw new Error('Invalid finish message');
    }
}
exports.verifyFinishMessage = verifyFinishMessage;
function packFinishMessagePacket(opts) {
    const hash = computeFinishMessageHash(opts);
    const packet = Buffer.concat([
        Buffer.from([constants_1.SUPPORTED_RECORD_TYPE_MAP.FINISHED, 0x00]),
        (0, packets_1.packWithLength)(hash)
    ]);
    return packet;
}
exports.packFinishMessagePacket = packFinishMessagePacket;
function computeFinishMessageHash({ secret, handshakeMessages, cipherSuite }) {
    const { hashAlgorithm, hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    const handshakeHash = (0, decryption_utils_1.getHash)(handshakeMessages, cipherSuite);
    const finishKey = (0, decryption_utils_1.hkdfExtractAndExpandLabel)(hashAlgorithm, secret, 'finished', Buffer.alloc(0), hashLength);
    const computedData = (0, crypto_1.createHmac)(hashAlgorithm, finishKey).update(handshakeHash).digest();
    return computedData;
}
