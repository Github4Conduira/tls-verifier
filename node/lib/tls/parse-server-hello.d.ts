/// <reference types="node" />
export declare function parseServerHello(data: Buffer): {
    serverVersion: Buffer;
    serverRandom: Buffer;
    sessionId: Buffer;
    cipherSuite: "TLS_CHACHA20_POLY1305_SHA256" | "TLS_AES_256_GCM_SHA384" | "TLS_AES_128_GCM_SHA256";
    publicKey: Buffer;
    publicKeyType: "X25519";
    supportsPsk: boolean;
};
