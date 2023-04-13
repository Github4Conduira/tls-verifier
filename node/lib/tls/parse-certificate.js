"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCertificateChain = exports.verifyCertificateSignature = exports.parseServerCertificateVerify = exports.parseCertificates = void 0;
const utils_1 = require("../utils");
const x509_1 = require("../utils/x509");
const constants_1 = require("./constants");
const packets_1 = require("./packets");
const root_ca_1 = require("./root-ca");
function parseCertificates(data) {
    // context, kina irrelevant
    const ctx = read(1)[0];
    // the data itself
    data = readWLength(3);
    const certificates = [];
    while (data.length > 0) {
        // the certificate data
        const cert = readWLength(3);
        const certObj = (0, x509_1.loadX509FromDer)(cert);
        certificates.push(certObj);
        // extensions
        readWLength(2);
    }
    return {
        certificates,
        ctx
    };
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
exports.parseCertificates = parseCertificates;
function parseServerCertificateVerify(data) {
    // data = readWLength(2)
    const algorithmBytes = read(2);
    const algorithm = constants_1.SUPPORTED_SIGNATURE_ALGS.find(alg => (constants_1.SUPPORTED_SIGNATURE_ALGS_MAP[alg]
        .identifier
        .equals(algorithmBytes)));
    if (!algorithm) {
        throw new Error(`Unsupported signature algorithm '${algorithmBytes.toString('hex')}'`);
    }
    const signature = readWLength(2);
    return { algorithm, signature };
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
exports.parseServerCertificateVerify = parseServerCertificateVerify;
function verifyCertificateSignature({ signature, algorithm, publicKey, hellos, cipherSuite }) {
    const { verify } = constants_1.SUPPORTED_SIGNATURE_ALGS_MAP[algorithm];
    const data = getSignatureData();
    const verified = verify(data, signature, publicKey);
    if (!verified) {
        throw new Error('Signature verification failed');
    }
    function getSignatureData() {
        const handshakeHash = (0, utils_1.getHash)(hellos, cipherSuite);
        const content = Buffer.concat([
            Buffer.alloc(64, 0x20),
            Buffer.from('TLS 1.3, server CertificateVerify'),
            Buffer.alloc(1, 0x0),
            handshakeHash
        ]);
        return content;
    }
}
exports.verifyCertificateSignature = verifyCertificateSignature;
function verifyCertificateChain(chain, host, additionalRootCAs) {
    const rootCAs = [
        ...root_ca_1.ROOT_CAS,
        ...additionalRootCAs || []
    ];
    for (let i = 0; i < chain.length - 1; i++) {
        const issuer = chain[i + 1];
        if (!issuer.isIssuer(chain[i])) {
            throw new Error(`Certificate ${i} was not issued by certificate ${i + 1}`);
        }
        if (!issuer.verifyIssued(chain[i])) {
            throw new Error(`Certificate ${i} issue verification failed`);
        }
    }
    const root = chain[chain.length - 1];
    const rootIssuer = rootCAs.find(r => r.isIssuer(root));
    if (!rootIssuer) {
        throw new Error('Root CA not found. Could not verify certificate');
    }
    const verified = rootIssuer.verifyIssued(root);
    if (!verified) {
        throw new Error('Root CA did not issue certificate');
    }
}
exports.verifyCertificateChain = verifyCertificateChain;
