export type UintArray = Uint32Array;
export type Proof = {
    /** serialised SnarkJS proof */
    proofJson: string;
    /**
     * the decrypted text that is
     * congruent with the redacted plaintext
     */
    decryptedRedactedCiphertext: UintArray;
};
/**
 * either loaded in memory Uint8array or string,
 * to load from file
 * */
type ZKInput = Uint8Array | string;
export type VerificationKey = {
    /** binary data for .zkey file */
    data: ZKInput;
    json?: any;
};
export type ZKParams = {
    zkey: VerificationKey;
    circuitWasm: ZKInput;
};
export type Redaction = {
    startIndex: number;
    endIndex: number;
};
export type PrivateInput = {
    /** AES-256-CTR key to decrypt ciphertext */
    key: Uint8Array;
    /** IV for the ciphertext decryption */
    iv: Uint8Array;
    /** counter to start decryption from */
    startCounter: number;
};
export type PublicInput = {
    /** the ciphertext to decrypt */
    ciphertext: Uint8Array;
    /** the redacted plaintext */
    redactedPlaintext: Uint8Array;
};
export {};
