"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadX509FromDer = exports.loadX509FromPem = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
function loadX509FromPem(pem) {
    const cert = node_forge_1.default.pki.certificateFromPem(pem.toString('utf-8'));
    return {
        internal: cert,
        isIssuer(ofCert) {
            return ofCert.internal.isIssuer(cert);
        },
        getPublicKey() {
            return node_forge_1.default.pki.publicKeyToPem(cert.publicKey);
        },
        verifyIssued(otherCert) {
            return cert.verify(otherCert.internal);
        },
        serialiseToPem() {
            return node_forge_1.default.pki.certificateToPem(cert);
        },
    };
}
exports.loadX509FromPem = loadX509FromPem;
function loadX509FromDer(der) {
    const PEM_PREFIX = '-----BEGIN CERTIFICATE-----\n';
    const PEM_POSTFIX = '-----END CERTIFICATE-----';
    const splitText = der.toString('base64').match(/.{0,64}/g).join('\n');
    const pem = `${PEM_PREFIX}${splitText}${PEM_POSTFIX}`;
    return loadX509FromPem(pem);
}
exports.loadX509FromDer = loadX509FromDer;
