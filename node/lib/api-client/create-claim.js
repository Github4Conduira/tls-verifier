"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSmartContractCreateRequest = exports.createClaim = void 0;
const grpc_web_node_http_transport_1 = require("@improbable-eng/grpc-web-node-http-transport");
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const ethers_1 = require("ethers");
const nice_grpc_web_1 = require("nice-grpc-web");
const api_1 = require("../proto/api");
const providers_1 = __importDefault(require("../providers"));
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const generate_provider_receipt_1 = require("./generate-provider-receipt");
/**
 * Create a claim on chain
 * @param param0 parameters to create the claim with
 */
async function createClaim({ name, params, context, secretParams, requestCreate, resumeFromStep, didUpdateCreateStep, additionalConnectOpts, makeGrpcClient, logger, }) {
    logger = logger || logger_1.default;
    if (!providers_1.default[name].areValidParams(params)) {
        throw new Error(`Invalid params for provider "${name}"`);
    }
    if (!makeGrpcClient) {
        makeGrpcClient = defaultMakeGrpcClient;
    }
    additionalConnectOpts = {
        ...providers_1.default[name].additionalClientOptions || {},
        ...additionalConnectOpts,
    };
    let chainId;
    let claimId;
    let witnessHosts;
    const claimInfo = {
        provider: name,
        parameters: JSON.stringify(params),
        context: context || ''
    };
    if (!resumeFromStep) {
        const infoHash = (0, reclaim_crypto_sdk_1.hashClaimInfo)(claimInfo);
        const data = await requestCreate(infoHash, logger);
        chainId = data.chainId;
        claimId = data.claimId;
        witnessHosts = data.witnessHosts;
        didUpdateCreateStep === null || didUpdateCreateStep === void 0 ? void 0 : didUpdateCreateStep({
            name: 'creating',
            chainId: data.chainId,
            claimId,
            witnessHosts
        });
    }
    else {
        chainId = resumeFromStep.chainId;
        if (resumeFromStep.name === 'creating') {
            witnessHosts = resumeFromStep.witnessHosts;
            claimId = resumeFromStep.claimId;
        }
        else {
            witnessHosts = [];
            claimId = resumeFromStep.claimData.claimId;
        }
    }
    logger = logger.child({ claimId: claimId.toString() });
    logger.info({ witnessHosts }, 'got claimID ID, sending requests to witnesses');
    if (!(witnessHosts === null || witnessHosts === void 0 ? void 0 : witnessHosts.length)) {
        throw new Error('No witness hosts were provided');
    }
    let claimData;
    const signatures = (resumeFromStep === null || resumeFromStep === void 0 ? void 0 : resumeFromStep.name) === 'witness-done'
        ? [...resumeFromStep.signaturesDone]
        : [];
    for (const oracleHost of witnessHosts) {
        logger.trace({ oracleHost }, 'generating signature for oracle host');
        const grpcUrl = oracleHost.startsWith('http:') || oracleHost.startsWith('https:')
            ? oracleHost
            : `https://${oracleHost}`;
        const { signature, claimData: r } = await generateSignature(grpcUrl);
        claimData = r;
        signatures.push(signature);
        logger.info({ oracleHost }, 'generated signature for oracle host');
        didUpdateCreateStep === null || didUpdateCreateStep === void 0 ? void 0 : didUpdateCreateStep({
            name: 'witness-done',
            chainId,
            signaturesDone: signatures,
            claimData,
        });
    }
    return {
        claimId,
        claimData: claimData,
        signatures,
        witnessHosts,
        chainId
    };
    async function generateSignature(grpcWebUrl) {
        // the trailing slash messes up the grpc-web client
        if (grpcWebUrl.endsWith('/')) {
            grpcWebUrl = grpcWebUrl.slice(0, -1);
        }
        const grpcClient = makeGrpcClient(grpcWebUrl);
        const { claimData, signature, } = await (0, generate_provider_receipt_1.generateProviderReceipt)({
            name,
            secretParams,
            params,
            requestData: {
                chainId,
                claimId: +claimId,
                info: claimInfo
            },
            client: grpcClient,
            additionalConnectOpts,
            logger,
        });
        return {
            signature: '0x' + Buffer.from(signature).toString('hex'),
            claimData
        };
    }
}
exports.createClaim = createClaim;
function defaultMakeGrpcClient(url) {
    const grpcChannel = (0, nice_grpc_web_1.createChannel)(url, (0, grpc_web_node_http_transport_1.NodeHttpTransport)());
    return (0, nice_grpc_web_1.createClient)(api_1.ReclaimWitnessDefinition, grpcChannel, {});
}
function makeSmartContractCreateRequest({ chainId, signer, authorisation, }) {
    return async (infoHash, logger) => {
        var _a, _b;
        let contract = (0, utils_1.getContract)(chainId)
            .connect(signer);
        contract = contract.connect(signer.connect(contract.provider));
        const fees = await contract.createFees();
        logger.info({ fees: ethers_1.ethers.utils.formatEther(fees) }, 'got create fees');
        const tx = authorisation
            ? await contract.requestClaimCreateForAnother(authorisation.signature, infoHash, authorisation.timestampMs, { value: fees })
            : await contract.requestClaimCreate(infoHash, { value: fees });
        const result = await tx.wait();
        const createRequestData = (_b = (_a = result.events) === null || _a === void 0 ? void 0 : _a.find(event => event.event === 'ClaimCreationRequested')) === null || _b === void 0 ? void 0 : _b.args;
        if (!createRequestData) {
            throw new Error(`Failed to get request data from tx: "${result.transactionHash}"`);
        }
        return {
            chainId: chainId,
            claimId: createRequestData.claimId.toNumber(),
            witnessHosts: createRequestData.witnessHosts
        };
    };
}
exports.makeSmartContractCreateRequest = makeSmartContractCreateRequest;
