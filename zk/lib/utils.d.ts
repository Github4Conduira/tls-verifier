/// <reference types="node" />
export declare function encryptData(plaintext: Uint8Array, key: Uint8Array, iv: Uint8Array): Buffer;
export declare function toUintArray(buf: Uint8Array | Buffer): Uint32Array;
export declare function makeUintArray(init: number | number[]): Uint32Array;
