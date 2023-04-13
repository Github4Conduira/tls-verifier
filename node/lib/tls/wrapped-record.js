"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIV = exports.parseWrappedRecord = exports.encryptWrappedRecord = exports.decryptWrappedRecord = void 0;
const utils_1 = require("../utils");
const constants_1 = require("./constants");
function decryptWrappedRecord(encryptedData, { authTag, key, iv, recordHeader, recordNumber, cipherSuite, crypto, }) {
    crypto || (crypto = utils_1.NODEJS_TLS_CRYPTO);
    iv = recordNumber === undefined
        ? iv
        : generateIV(iv, recordNumber);
    const { plaintext } = crypto.decrypt(cipherSuite, {
        key,
        iv,
        data: encryptedData,
        aead: recordHeader,
        authTag,
    });
    if (plaintext.length !== encryptedData.length) {
        throw new Error('Decrypted length does not match encrypted length');
    }
    return {
        plaintext: plaintext.slice(0, -1),
        contentType: plaintext[plaintext.length - 1],
    };
}
exports.decryptWrappedRecord = decryptWrappedRecord;
function encryptWrappedRecord({ plaintext, contentType }, { key, iv, recordHeader, recordNumber, cipherSuite, crypto, }) {
    crypto || (crypto = utils_1.NODEJS_TLS_CRYPTO);
    const completePlaintext = Buffer.concat([
        plaintext,
        Buffer.from([constants_1.CONTENT_TYPE_MAP[contentType]])
    ]);
    iv = recordNumber === undefined ? iv : generateIV(iv, recordNumber);
    return crypto.encrypt(cipherSuite, {
        key,
        iv,
        data: completePlaintext,
        aead: recordHeader,
    });
}
exports.encryptWrappedRecord = encryptWrappedRecord;
function parseWrappedRecord(data) {
    const encryptedData = data.slice(0, data.length - constants_1.AUTH_TAG_BYTE_LENGTH);
    const authTag = data.slice(data.length - constants_1.AUTH_TAG_BYTE_LENGTH);
    return { encryptedData, authTag };
}
exports.parseWrappedRecord = parseWrappedRecord;
function generateIV(iv, recordNumber) {
    // make the recordNumber a buffer, so we can XOR with the main IV
    // to generate the specific IV to decrypt this packet
    const recordBuffer = Buffer.alloc(iv.length);
    recordBuffer.writeUInt32BE(recordNumber, iv.length - 4);
    return (0, utils_1.xor)(iv, recordBuffer);
}
exports.generateIV = generateIV;
