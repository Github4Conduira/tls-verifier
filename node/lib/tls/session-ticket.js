"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPskFromTicket = exports.parseSessionTicket = void 0;
const crypto_1 = require("crypto");
const futoin_hkdf_1 = require("futoin-hkdf");
const decryption_utils_1 = require("../utils/decryption-utils");
const constants_1 = require("./constants");
const packets_1 = require("./packets");
function parseSessionTicket(data) {
    const lifetimeS = read(4).readUint32BE();
    const ticketAgeAddMs = read(4).readUint32BE();
    const nonce = readWLength(1);
    const ticket = readWLength(2);
    const extensions = readWLength(2);
    const sessionTicket = {
        ticket,
        lifetimeS,
        ticketAgeAddMs,
        nonce,
        expiresAt: new Date(Date.now() + lifetimeS * 1000),
        extensions
    };
    return sessionTicket;
    function read(bytes) {
        const result = data.slice(0, bytes);
        data = data.slice(bytes);
        return result;
    }
    function readWLength(bytesLength = 2) {
        const content = (0, packets_1.readWithLength)(data, bytesLength);
        data = data.slice(content.length + bytesLength);
        return content;
    }
}
exports.parseSessionTicket = parseSessionTicket;
function getPskFromTicket(ticket, { masterKey, hellos, cipherSuite }) {
    const { hashAlgorithm, hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    const handshakeHash = (0, decryption_utils_1.getHash)(hellos, cipherSuite);
    const resumeMasterSecret = (0, decryption_utils_1.hkdfExtractAndExpandLabel)(hashAlgorithm, masterKey, 'res master', handshakeHash, hashLength);
    const psk = (0, decryption_utils_1.hkdfExtractAndExpandLabel)(hashAlgorithm, resumeMasterSecret, 'resumption', ticket.nonce, hashLength);
    const emptyHash = (0, crypto_1.createHash)(hashAlgorithm).update('').digest();
    const earlySecret = (0, futoin_hkdf_1.extract)(hashAlgorithm, hashLength, psk, '');
    const binderKey = (0, decryption_utils_1.hkdfExtractAndExpandLabel)(hashAlgorithm, earlySecret, 'res binder', emptyHash, hashLength);
    // const clientEarlyTrafficSecret = hkdfExtractAndExpandLabel(hashAlgorithm, earlySecret, 'c e traffic', Buffer.alloc(0), hashLength)
    const finishKey = (0, decryption_utils_1.hkdfExtractAndExpandLabel)(hashAlgorithm, binderKey, 'finished', Buffer.alloc(0), hashLength);
    const ticketAge = Math.floor(ticket.lifetimeS / 1000 + ticket.ticketAgeAddMs);
    return {
        identity: ticket.ticket,
        ticketAge,
        finishKey,
        resumeMasterSecret,
        earlySecret,
        cipherSuite,
    };
}
exports.getPskFromTicket = getPskFromTicket;
