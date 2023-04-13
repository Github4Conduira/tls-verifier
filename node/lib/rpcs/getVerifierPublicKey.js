"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const signatures_1 = require("../signatures");
const getVerifierPublicKey = async ({}, {}) => {
    return {
        publicKey: await signatures_1.SelectedServiceSignature.getPublicKey(config_1.PRIVATE_KEY),
        signatureType: signatures_1.SelectedServiceSignatureType,
    };
};
exports.default = getVerifierPublicKey;
