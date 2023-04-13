/// <reference types="node" />
import type { CertificatePublicKey, X509Certificate } from '../types';
import { SUPPORTED_CIPHER_SUITES_ID_MAP, SUPPORTED_SIGNATURE_ALGS_MAP } from './constants';
type VerifySignatureOptions = {
    signature: Buffer;
    algorithm: keyof typeof SUPPORTED_SIGNATURE_ALGS_MAP;
    publicKey: CertificatePublicKey;
    cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITES_ID_MAP;
    hellos: Buffer[] | Buffer;
};
export declare function parseCertificates(data: Buffer): {
    certificates: X509Certificate<any>[];
    ctx: number;
};
export declare function parseServerCertificateVerify(data: Buffer): {
    algorithm: "RSA_PSS_RSAE_SHA256" | "ED25519" | "RSA_PKCS1_SHA512";
    signature: Buffer;
};
export declare function verifyCertificateSignature({ signature, algorithm, publicKey, hellos, cipherSuite }: VerifySignatureOptions): void;
export declare function verifyCertificateChain(chain: X509Certificate[], host: string, additionalRootCAs?: X509Certificate[]): void;
export {};
