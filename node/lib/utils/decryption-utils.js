"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHash = exports.hkdfExtractAndExpandLabel = exports.deriveTrafficKeysForSide = exports.deriveTrafficKeys = exports.computeSharedKeys = exports.computeUpdatedTrafficMasterSecret = exports.computeSharedMasterKey = exports.NODEJS_TLS_CRYPTO = void 0;
const crypto_1 = require("crypto");
const futoin_hkdf_1 = require("futoin-hkdf");
const constants_1 = require("../tls/constants");
const packets_1 = require("../tls/packets");
const x25519_1 = require("./x25519");
exports.NODEJS_TLS_CRYPTO = {
    encrypt(cipherSuite, { key, iv, data, aead }) {
        const { cipher } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
        const encryptr = (0, crypto_1.createCipheriv)(cipher, key, iv, 
        // @ts-expect-error
        { authTagLength: constants_1.AUTH_TAG_BYTE_LENGTH });
        encryptr.setAutoPadding(false);
        encryptr.setAAD(aead, { plaintextLength: data.length });
        const ciphertext = Buffer.concat([
            encryptr.update(data),
            encryptr.final()
        ]);
        const authTag = encryptr.getAuthTag();
        return { ciphertext, authTag };
    },
    decrypt(cipherSuite, { key, iv, data, aead, authTag }) {
        const { cipher } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
        const decipher = (0, crypto_1.createDecipheriv)(cipher, key, iv, 
        // @ts-expect-error
        { authTagLength: constants_1.AUTH_TAG_BYTE_LENGTH });
        decipher.setAutoPadding(false);
        if (authTag) {
            decipher.setAuthTag(authTag);
        }
        decipher.setAAD(aead, { plaintextLength: data.length });
        const plaintext = Buffer.concat([
            decipher.update(data),
            // essentially, we skip validating the data
            // if we don't have an auth tag
            // this is insecure generally, and auth tag validation
            // should happen at some point
            authTag ? decipher.final() : Buffer.alloc(0),
        ]);
        return { plaintext };
    }
};
function computeSharedMasterKey(clientPrivateKey, serverPublicKey) {
    return (0, x25519_1.calculateSharedKey)(serverPublicKey, clientPrivateKey);
}
exports.computeSharedMasterKey = computeSharedMasterKey;
function computeUpdatedTrafficMasterSecret(masterSecret, cipherSuite) {
    const { hashAlgorithm, hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    return hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'traffic upd', Buffer.alloc(0), hashLength);
}
exports.computeUpdatedTrafficMasterSecret = computeUpdatedTrafficMasterSecret;
function computeSharedKeys({ hellos, masterSecret: masterKey, cipherSuite, secretType, earlySecret }) {
    const { hashAlgorithm, hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    const emptyHash = (0, crypto_1.createHash)(hashAlgorithm).update('').digest();
    const zeros = Buffer.alloc(hashLength);
    let handshakeTrafficSecret;
    if (secretType === 'hs') {
        // some hashes
        earlySecret = earlySecret || (0, futoin_hkdf_1.extract)(hashAlgorithm, hashLength, zeros, '');
        const derivedSecret = hkdfExtractAndExpandLabel(hashAlgorithm, earlySecret, 'derived', emptyHash, hashLength);
        handshakeTrafficSecret = (0, futoin_hkdf_1.extract)(hashAlgorithm, hashLength, masterKey, derivedSecret);
    }
    else {
        const derivedSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterKey, 'derived', emptyHash, hashLength);
        handshakeTrafficSecret = (0, futoin_hkdf_1.extract)(hashAlgorithm, hashLength, zeros, derivedSecret);
    }
    return deriveTrafficKeys({
        hellos,
        cipherSuite,
        masterSecret: handshakeTrafficSecret,
        secretType
    });
}
exports.computeSharedKeys = computeSharedKeys;
function deriveTrafficKeys({ masterSecret, cipherSuite, hellos, secretType, }) {
    const { hashAlgorithm, hashLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    const handshakeHash = getHash(hellos, cipherSuite);
    const clientSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, `c ${secretType} traffic`, handshakeHash, hashLength);
    const serverSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, `s ${secretType} traffic`, handshakeHash, hashLength);
    const { encKey: clientEncKey, iv: clientIv } = deriveTrafficKeysForSide(clientSecret, cipherSuite);
    const { encKey: serverEncKey, iv: serverIv } = deriveTrafficKeysForSide(serverSecret, cipherSuite);
    return {
        masterSecret,
        clientSecret,
        serverSecret,
        clientEncKey,
        serverEncKey,
        clientIv,
        serverIv
    };
}
exports.deriveTrafficKeys = deriveTrafficKeys;
function deriveTrafficKeysForSide(masterSecret, cipherSuite) {
    const { hashAlgorithm, keyLength } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
    const ivLen = 12;
    const encKey = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'key', Buffer.alloc(0), keyLength);
    const iv = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'iv', Buffer.alloc(0), ivLen);
    return { masterSecret, encKey, iv };
}
exports.deriveTrafficKeysForSide = deriveTrafficKeysForSide;
function hkdfExtractAndExpandLabel(algorithm, key, label, context, length) {
    const tmpLabel = `tls13 ${label}`;
    const lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16BE(length, 0);
    const hkdfLabel = Buffer.concat([
        lengthBuffer,
        (0, packets_1.packWithLength)(Buffer.from(tmpLabel)).slice(1),
        (0, packets_1.packWithLength)(Buffer.from(context)).slice(1)
    ]);
    return (0, futoin_hkdf_1.expand)(algorithm, length, Buffer.from(key), length, hkdfLabel);
}
exports.hkdfExtractAndExpandLabel = hkdfExtractAndExpandLabel;
function getHash(msgs, cipherSuite) {
    if (Array.isArray(msgs)) {
        const { hashAlgorithm } = constants_1.SUPPORTED_CIPHER_SUITE_MAP[cipherSuite];
        const hasher = (0, crypto_1.createHash)(hashAlgorithm);
        for (const msg of msgs) {
            hasher.update(msg);
        }
        return hasher.digest();
    }
    return msgs;
}
exports.getHash = getHash;
