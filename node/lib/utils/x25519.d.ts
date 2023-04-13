/// <reference types="node" />
export declare function calculateSharedKey(pubKey: Buffer, privKey: Buffer): Buffer;
export declare function generateX25519KeyPair(): {
    pubKey: Buffer;
    privKey: Buffer;
};
