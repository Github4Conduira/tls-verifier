"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedServiceSignature = exports.SelectedServiceSignatureType = exports.SIGNATURES = void 0;
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const api_1 = require("../proto/api");
exports.SIGNATURES = {
    [api_1.ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH]: reclaim_crypto_sdk_1.signatures,
};
exports.SelectedServiceSignatureType = api_1.ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH;
exports.SelectedServiceSignature = exports.SIGNATURES[exports.SelectedServiceSignatureType];
