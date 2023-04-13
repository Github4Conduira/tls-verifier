"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExtraChains = exports.getContract = exports.getClaimDataFromRequestId = void 0;
const ethers_1 = require("ethers");
const config_json_1 = __importDefault(require("../contracts/config.json"));
const types_1 = require("../types");
const files_1 = require("./files");
const generics_1 = require("./generics");
const logger_1 = __importDefault(require("./logger"));
const existingContractsMap = {};
// default file name for extra contracts config
const EXTRA_CHAINS_FILE_NAME = './src/extra-contracts-config.json';
/**
 * Get details about the claim from the specified chain
 * @param chainId Chain where the claim is stored
 * @param claimId ID of the claim request
 */
async function getClaimDataFromRequestId(chainId, claimId) {
    const contract = getContract(chainId);
    const pendingCreateData = await contract.claimCreations(claimId);
    if (!(pendingCreateData === null || pendingCreateData === void 0 ? void 0 : pendingCreateData.claim.claimId)) {
        throw new generics_1.ServerError(generics_1.Status.NOT_FOUND, `Invalid request ID: ${claimId}`);
    }
    const claim = pendingCreateData.claim;
    return {
        infoHash: claim.infoHash,
        owner: claim.owner.toLowerCase(),
        timestampS: claim.timestampS,
        claimId: claim.claimId
    };
}
exports.getClaimDataFromRequestId = getClaimDataFromRequestId;
function getContract(chainId) {
    const chainKey = `0x${chainId.toString(16)}`;
    if (!existingContractsMap[chainKey]) {
        const contractData = config_json_1.default[chainKey];
        if (!contractData) {
            throw new generics_1.ServerError(generics_1.Status.INVALID_ARGUMENT, `Unsupported chain: "${chainKey}"`);
        }
        const rpcProvider = new ethers_1.ethers.providers.JsonRpcProvider(contractData.rpcUrl);
        existingContractsMap[chainKey] = types_1.Reclaim__factory.connect(contractData.address, rpcProvider);
    }
    return existingContractsMap[chainKey];
}
exports.getContract = getContract;
/**
 * Optionally load extra chains & RPC urls from a file.
 * This is useful to extend the functionality of the server
 * without having to recompile the code.
 */
function loadExtraChains(filename) {
    const dataTxt = (0, files_1.readFile)(filename);
    if (!dataTxt) {
        return;
    }
    const extraChains = JSON.parse(dataTxt);
    for (const chain in extraChains) {
        config_json_1.default[chain] = extraChains[chain];
    }
    logger_1.default.info(`injected ${Object.keys(extraChains).length} extra chains`);
}
exports.loadExtraChains = loadExtraChains;
loadExtraChains(EXTRA_CHAINS_FILE_NAME);
