"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGrpcClient = void 0;
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const nice_grpc_web_1 = require("nice-grpc-web");
const proto_1 = require("../proto");
const config_1 = require("../config");
async function makeGrpcClient(privateKey) {
    // grpc-web channel
    // both the witness & backend can be accessed from this URL
    const channel = (0, nice_grpc_web_1.createChannel)(config_1.BACKEND_URL);
    // metadata for auth token
    const metadata = new nice_grpc_web_1.Metadata();
    const token = await (0, reclaim_crypto_sdk_1.generateAuthToken)(privateKey);
    metadata.set('Authorization', token);
    // actual client to communicate with backend
    const client = (0, nice_grpc_web_1.createClient)(proto_1.ReclaimBackendDefinition, channel, { '*': { metadata } });
    return client;
}
exports.makeGrpcClient = makeGrpcClient;
