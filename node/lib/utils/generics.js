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
exports.loadRootCAsInFolder = exports.signProviderClaimData = exports.unixTimestampSeconds = exports.getTranscriptString = exports.xor = exports.bufferFromHexStringWithWhitespace = exports.toHexStringWithWhitespace = exports.Status = exports.ServerError = void 0;
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const config_1 = require("../config");
const api_1 = require("../proto/api");
const signatures_1 = require("../signatures");
const x509_1 = require("./x509");
// exporting here for better compatibility when importing into a browser env
var nice_grpc_common_1 = require("nice-grpc-common");
Object.defineProperty(exports, "ServerError", { enumerable: true, get: function () { return nice_grpc_common_1.ServerError; } });
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return nice_grpc_common_1.Status; } });
/**
 * Converts a buffer to a hex string with whitespace between each byte
 * @returns eg. '01 02 03 04'
 */
function toHexStringWithWhitespace(buff) {
    let hex = buff.toString('hex');
    let i = 2;
    while (i < hex.length) {
        hex = hex.slice(0, i) + ' ' + hex.slice(i);
        i += 3;
    }
    return hex;
}
exports.toHexStringWithWhitespace = toHexStringWithWhitespace;
/**
 * converts a space separated hex string to a buffer
 * @param txt eg. '01 02 03 04'
 */
function bufferFromHexStringWithWhitespace(txt) {
    return Buffer.from(txt.replace(/\s/g, ''), 'hex');
}
exports.bufferFromHexStringWithWhitespace = bufferFromHexStringWithWhitespace;
function xor(a, b) {
    const result = Buffer.alloc(a.length);
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] ^ b[i];
    }
    return result;
}
exports.xor = xor;
function getTranscriptString(transcript) {
    var _a;
    const strList = [];
    for (const msg of transcript) {
        const sender = msg.senderType === api_1.TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT
            ? 'client'
            : 'server';
        const content = msg.redacted ? '****' : Buffer.from(msg.message).toString();
        if ((_a = strList[strList.length - 1]) === null || _a === void 0 ? void 0 : _a.startsWith(sender)) {
            strList[strList.length - 1] += content;
        }
        else {
            strList.push(`${sender}: ${content}`);
        }
    }
    return strList.join('\n');
}
exports.getTranscriptString = getTranscriptString;
const unixTimestampSeconds = () => Math.floor(Date.now() / 1000);
exports.unixTimestampSeconds = unixTimestampSeconds;
async function signProviderClaimData(data) {
    const dataStr = (0, reclaim_crypto_sdk_1.createSignDataForClaim)(data);
    return signatures_1.SelectedServiceSignature.sign(Buffer.from(dataStr, 'utf-8'), config_1.PRIVATE_KEY);
}
exports.signProviderClaimData = signProviderClaimData;
/**
 * Loads all .pem certificates in the given folder
 * @param path folder to load certificates from
 */
async function loadRootCAsInFolder(path) {
    const { readFileSync, readdirSync } = await Promise.resolve().then(() => __importStar(require('fs')));
    const contents = await readdirSync(path);
    const cas = [];
    for (const file of contents) {
        const fullPath = `${path}/${file}`;
        if (file.endsWith('.pem')) {
            const pemData = await readFileSync(fullPath);
            const cert = (0, x509_1.loadX509FromPem)(pemData);
            cas.push(cert);
        }
    }
    return cas;
}
exports.loadRootCAsInFolder = loadRootCAsInFolder;
