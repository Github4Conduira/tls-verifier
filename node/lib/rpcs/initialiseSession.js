"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const providers_1 = __importDefault(require("../providers"));
const new_session_1 = __importDefault(require("../sessions/new-session"));
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const initialiseSession = async ({ receiptGenerationRequest, providerClaimRequest }) => {
    let host;
    let port;
    let attachedData;
    if (receiptGenerationRequest === null || receiptGenerationRequest === void 0 ? void 0 : receiptGenerationRequest.host) {
        host = receiptGenerationRequest.host;
        port = receiptGenerationRequest.port;
        attachedData = {};
    }
    else if (providerClaimRequest === null || providerClaimRequest === void 0 ? void 0 : providerClaimRequest.claimId) {
        const info = providerClaimRequest.info;
        const claimData = await (0, utils_2.getClaimDataFromRequestId)(providerClaimRequest.chainId, providerClaimRequest.claimId);
        const hash = (0, reclaim_crypto_sdk_1.hashClaimInfo)(info);
        if (hash !== claimData.infoHash) {
            throw new utils_1.ServerError(utils_1.Status.INVALID_ARGUMENT, `Claim info hash mismatch, expected ${claimData.infoHash}, got ${hash}`);
        }
        const res = validateProviderAndJsonParams(info.provider, info.parameters);
        const claim = {
            provider: info.provider,
            parameters: info.parameters,
            context: info.context,
            claimId: +claimData.claimId.toString(),
            timestampS: claimData.timestampS,
            owner: claimData.owner.toLowerCase(),
        };
        host = res.host;
        port = res.port;
        attachedData = { claim };
    }
    else {
        throw new utils_1.ServerError(utils_1.Status.INVALID_ARGUMENT, 'Need either a receiptGenerationRequest or providerClaimRequest or simulationRequest');
    }
    const { id } = await (0, new_session_1.default)(host, port, attachedData);
    return { sessionId: id };
};
function validateProviderAndJsonParams(provider, jsonParams) {
    if (!(provider in providers_1.default)) {
        throw new utils_1.ServerError(utils_1.Status.FAILED_PRECONDITION, `Provider not found: '${provider}'`);
    }
    const prov = providers_1.default[provider];
    const params = JSON.parse(jsonParams);
    if (!prov.areValidParams(params)) {
        throw new utils_1.ServerError(utils_1.Status.INVALID_ARGUMENT, `Invalid params: ${jsonParams}`);
    }
    // @ts-ignore
    const hostPort = prov.hostPort instanceof Function ? prov.hostPort(params) : prov.hostPort;
    const splitResult = hostPort.split(':');
    return {
        host: splitResult[0],
        port: +splitResult[1],
    };
}
exports.default = initialiseSession;
