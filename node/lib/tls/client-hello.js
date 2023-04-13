"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packPresharedKeyExtension = exports.computeBinderSuffix = exports.packClientHello = void 0;
const crypto_1 = require("crypto");
const decryption_utils_1 = require("../utils/decryption-utils");
const constants_1 = require("./constants");
const packets_1 = require("./packets");
function packClientHello({ host, sessionId, random, publicKey, publicKeyType, psk, cipherSuites, }) {
    // generate random & sessionId if not provided
    random = random || (0, crypto_1.randomBytes)(32);
    sessionId = sessionId || (0, crypto_1.randomBytes)(32);
    const packedSessionId = (0, packets_1.packWithLength)(sessionId).slice(1);
    const cipherSuiteList = (cipherSuites || Object.keys(constants_1.SUPPORTED_CIPHER_SUITE_MAP))
        .map(cipherSuite => constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite].identifier);
    const packedCipherSuites = (0, packets_1.packWithLength)(Buffer.concat(cipherSuiteList));
    const extensionsList = [
        packServerNameExtension(host),
        packSupportedGroupsExtension(),
        packSessionTicketExtension(),
        packVersionsExtension(),
        packSignatureAlgorithmsExtension(),
        packPresharedKeyModeExtension(),
        packKeyShareExtension(publicKey, publicKeyType || 'X25519')
    ];
    if (psk) {
        extensionsList.push(packPresharedKeyExtension(psk));
    }
    const packedExtensions = (0, packets_1.packWithLength)(Buffer.concat(extensionsList));
    const handshakeData = Buffer.concat([
        constants_1.LEGACY_PROTOCOL_VERSION,
        random,
        packedSessionId,
        packedCipherSuites,
        constants_1.COMPRESSION_MODE,
        packedExtensions
    ]);
    const packedHandshake = Buffer.concat([
        Buffer.from([constants_1.SUPPORTED_RECORD_TYPE_MAP.CLIENT_HELLO]),
        (0, packets_1.packWith3ByteLength)(handshakeData)
    ]);
    if (psk) {
        const { hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[psk.cipherSuite];
        const prefixHandshake = packedHandshake.slice(0, -hashLength - 3);
        const binder = computeBinderSuffix(prefixHandshake, psk);
        binder.copy(packedHandshake, packedHandshake.length - binder.length);
    }
    return packedHandshake;
}
exports.packClientHello = packClientHello;
function computeBinderSuffix(packedHandshakePrefix, psk) {
    const { hashAlgorithm } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[psk.cipherSuite];
    const hashedHelloHandshake = (0, decryption_utils_1.getHash)([packedHandshakePrefix], psk.cipherSuite);
    const binder = (0, crypto_1.createHmac)(hashAlgorithm, psk.finishKey).update(hashedHelloHandshake).digest();
    return binder;
}
exports.computeBinderSuffix = computeBinderSuffix;
/**
 * Packs the preshared key extension; the binder is assumed to be 0
 * The empty binder is suffixed to the end of the extension
 * and should be replaced with the correct binder after the full handshake is computed
 */
function packPresharedKeyExtension({ identity, ticketAge, cipherSuite }) {
    const binderLength = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite].hashLength;
    const packedIdentity = (0, packets_1.packWithLength)(identity);
    const packedTicketAge = Buffer.alloc(4);
    packedTicketAge.writeUInt32BE(ticketAge);
    const serialisedIdentity = Buffer.concat([
        packedIdentity,
        packedTicketAge
    ]);
    const identityPacked = (0, packets_1.packWithLength)(serialisedIdentity);
    const binderHolderBytes = Buffer.alloc(binderLength + 2 + 1);
    binderHolderBytes.writeUint16BE(binderLength + 1, 0);
    binderHolderBytes.writeUint8(binderLength, 2);
    const total = Buffer.concat([
        identityPacked,
        // 2 bytes for binders
        // 1 byte for each binder length
        binderHolderBytes
    ]);
    const totalPacked = (0, packets_1.packWithLength)(total);
    const ext = Buffer.alloc(2 + totalPacked.length);
    ext.writeUint16BE(constants_1.SUPPORTED_EXTENSION_MAP.PRE_SHARED_KEY, 0);
    totalPacked.copy(ext, 2);
    return ext;
}
exports.packPresharedKeyExtension = packPresharedKeyExtension;
function packPresharedKeyModeExtension() {
    return packExtension({
        type: 'PRE_SHARED_KEY_MODE',
        data: Buffer.from([0x00, 0x01]),
        lengthBytes: 1
    });
}
function packSessionTicketExtension() {
    return packExtension({
        type: 'SESSION_TICKET',
        data: Buffer.from([])
    });
}
function packVersionsExtension() {
    return packExtension({
        type: 'SUPPORTED_VERSIONS',
        data: constants_1.CURRENT_PROTOCOL_VERSION,
        lengthBytes: 1
    });
}
function packSignatureAlgorithmsExtension() {
    return packExtension({
        type: 'SIGNATURE_ALGS',
        data: Buffer.concat(Object.values(constants_1.SUPPORTED_SIGNATURE_ALGS_MAP)
            .map(v => v.identifier))
    });
}
function packSupportedGroupsExtension() {
    return packExtension({
        type: 'SUPPORTED_GROUPS',
        // only support ed25519 groups at the moment
        data: Buffer.from([
            0x00, 0x1d,
            0x00, 0x18,
            0x00, 0x17
        ])
    });
}
function packKeyShareExtension(publicKey, type) {
    return packExtension({
        type: 'KEY_SHARE',
        data: Buffer.concat([
            constants_1.SUPPORTED_KEY_TYPE_MAP[type],
            (0, packets_1.packWithLength)(publicKey)
        ])
    });
}
function packServerNameExtension(host) {
    return packExtension({
        type: 'SERVER_NAME',
        data: Buffer.concat([
            // specify that this is a server hostname
            Buffer.from([0x0]),
            // pack the remaining data prefixed with length
            (0, packets_1.packWithLength)(Buffer.from(host, 'ascii'))
        ])
    });
}
function packExtension({ type, data, lengthBytes }) {
    lengthBytes = lengthBytes || 2;
    let packed = data.length ? (0, packets_1.packWithLength)(data) : data;
    if (lengthBytes === 1) {
        packed = packed.slice(1);
    }
    // 2 bytes for type, 2 bytes for packed data length
    const result = Buffer.alloc(2 + 2 + packed.length);
    result.writeUint8(constants_1.SUPPORTED_EXTENSION_MAP[type], 1);
    result.writeUint16BE(packed.length, 2);
    packed.copy(result, 4);
    return result;
}
