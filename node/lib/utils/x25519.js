"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateX25519KeyPair = exports.calculateSharedKey = void 0;
const crypto_1 = require("crypto");
const curveJs = __importStar(require("curve25519-js"));
// from: https://github.com/digitalbazaar/x25519-key-agreement-key-2019/blob/master/lib/crypto.js
const PUBLIC_KEY_DER_PREFIX = Buffer.from([
    48, 42, 48, 5, 6, 3, 43, 101, 110, 3, 33, 0
]);
const PRIVATE_KEY_DER_PREFIX = Buffer.from([
    48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 110, 4, 34, 4, 32
]);
function calculateSharedKey(pubKey, privKey) {
    if (typeof crypto_1.createPrivateKey === 'function' && typeof crypto_1.createPublicKey === 'function') {
        const nodePrivateKey = (0, crypto_1.createPrivateKey)({
            key: Buffer.concat([PRIVATE_KEY_DER_PREFIX, privKey]),
            format: 'der',
            type: 'pkcs8'
        });
        const nodePublicKey = (0, crypto_1.createPublicKey)({
            key: Buffer.concat([PUBLIC_KEY_DER_PREFIX, pubKey]),
            format: 'der',
            type: 'spki'
        });
        return (0, crypto_1.diffieHellman)({
            privateKey: nodePrivateKey,
            publicKey: nodePublicKey,
        });
    }
    return Buffer.from(curveJs.sharedKey(privKey, pubKey));
}
exports.calculateSharedKey = calculateSharedKey;
function generateX25519KeyPair() {
    if (typeof crypto_1.generateKeyPairSync === 'function') {
        const { publicKey: publicDerBytes, privateKey: privateDerBytes } = (0, crypto_1.generateKeyPairSync)('x25519', {
            publicKeyEncoding: { format: 'der', type: 'spki' },
            privateKeyEncoding: { format: 'der', type: 'pkcs8' }
        });
        const pubKey = publicDerBytes.slice(PUBLIC_KEY_DER_PREFIX.length, PUBLIC_KEY_DER_PREFIX.length + 32);
        const privKey = privateDerBytes.slice(PRIVATE_KEY_DER_PREFIX.length, PRIVATE_KEY_DER_PREFIX.length + 32);
        return {
            pubKey,
            privKey
        };
    }
    const keys = curveJs.generateKeyPair((0, crypto_1.randomBytes)(32));
    return {
        pubKey: Buffer.from(keys.public),
        privKey: Buffer.from(keys.private)
    };
}
exports.generateX25519KeyPair = generateX25519KeyPair;
