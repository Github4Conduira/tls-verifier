"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUintArray = exports.toUintArray = exports.encryptData = void 0;
const crypto_1 = require("crypto");
function encryptData(plaintext, key, iv) {
    // chacha20 encrypt
    const cipher = (0, crypto_1.createCipheriv)('chacha20-poly1305', key, iv);
    return Buffer.concat([
        cipher.update(plaintext),
        cipher.final()
    ]);
}
exports.encryptData = encryptData;
function toUintArray(buf) {
    buf = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
    const arr = makeUintArray(buf.length / 4);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = buf.readUInt32LE(i * 4);
    }
    return arr;
}
exports.toUintArray = toUintArray;
function makeUintArray(init) {
    return typeof init === 'number'
        ? new Uint32Array(init)
        : Uint32Array.from(init);
}
exports.makeUintArray = makeUintArray;
