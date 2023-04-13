"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProviderReceipt = void 0;
const providers_1 = __importDefault(require("../providers"));
const types_1 = require("../types");
const http_parser_1 = require("../utils/http-parser");
const logger_1 = __importDefault(require("../utils/logger"));
const make_api_tls_client_1 = require("./make-api-tls-client");
async function generateProviderReceipt({ name, secretParams, params, client, requestData, additionalConnectOpts, logger, }) {
    var _a;
    logger = logger || logger_1.default;
    const provider = providers_1.default[name];
    // @ts-ignore
    const hostPort = typeof provider.hostPort === 'function' ? provider.hostPort(params) : provider.hostPort;
    const [host, port] = hostPort.split(':');
    additionalConnectOpts = additionalConnectOpts || {};
    if ((_a = provider.additionalClientOptions) === null || _a === void 0 ? void 0 : _a.rootCAs) {
        additionalConnectOpts.rootCAs = [
            ...(additionalConnectOpts.rootCAs || []),
            ...provider.additionalClientOptions.rootCAs,
        ];
    }
    const apiClient = (0, make_api_tls_client_1.makeAPITLSClient)({
        host,
        port: port ? +port : types_1.DEFAULT_PORT,
        request: {
            providerClaimRequest: requestData,
            receiptGenerationRequest: undefined
        },
        client,
        logger,
        additionalConnectOpts,
        redactResponse: provider.getResponseRedactions
            ? res => {
                // @ts-ignore
                return provider.getResponseRedactions(res, params);
            }
            : undefined
    });
    const resParser = (0, http_parser_1.makeHttpResponseParser)();
    let endedHttpRequest;
    apiClient.handleDataFromServer(data => {
        resParser.onChunk(data);
        if (resParser.res.complete) {
            process.nextTick(() => {
                endedHttpRequest === null || endedHttpRequest === void 0 ? void 0 : endedHttpRequest();
            });
        }
    });
    const request = provider.createRequest(
    // @ts-ignore
    secretParams, params);
    logger.debug({ redactions: request.redactions.length }, 'generated request');
    await apiClient.connect();
    await apiClient.write(request.data, request.redactions);
    logger.info('wrote request to server');
    const waitForRequestEnd = new Promise((resolve) => {
        endedHttpRequest = resolve;
    });
    await waitForRequestEnd;
    const res = await apiClient.finish();
    logger.info({ claimData: res.claimData }, 'finished request');
    return res;
}
exports.generateProviderReceipt = generateProviderReceipt;
