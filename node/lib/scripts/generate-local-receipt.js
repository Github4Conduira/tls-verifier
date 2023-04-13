"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const env = process.env.NODE_ENV || 'development';
(0, dotenv_1.config)({ path: `.env.${env}` });
const promises_1 = require("fs/promises");
const nice_grpc_1 = require("nice-grpc");
const providers_1 = __importDefault(require("../providers"));
const make_grpc_server_1 = require("../server/make-grpc-server");
const logger_1 = __importDefault(require("../utils/logger"));
const __1 = require("..");
async function main() {
    const paramsJson = await getInputParameters();
    if (!(paramsJson.name in providers_1.default)) {
        throw new Error(`Unknown provider "${paramsJson.name}"`);
    }
    const { client, server, channel, } = await makeGrpcServerAndClient();
    const { receipt } = await (0, __1.generateProviderReceipt)({
        name: paramsJson.name,
        secretParams: paramsJson.secretParams,
        params: paramsJson.params,
        client,
        logger: logger_1.default,
    });
    channel.close();
    await server.close();
    const transcriptStr = (0, __1.getTranscriptString)(receipt.transcript);
    console.log('receipt:\n', transcriptStr);
    try {
        await providers_1.default[paramsJson.name].assertValidProviderReceipt(receipt, paramsJson.params);
        console.log(`receipt is valid for ${paramsJson.name} provider`);
    }
    catch (err) {
        console.error(`receipt is invalid for ${paramsJson.name} provider: "${err.message}"`);
    }
}
/// Run the gRPC server and return a client
/// that can be used to connect to it
async function makeGrpcServerAndClient() {
    const port = 50051;
    const server = await (0, make_grpc_server_1.makeGrpcServer)(port);
    const channel = (0, nice_grpc_1.createChannel)('localhost:' + port);
    const client = (0, nice_grpc_1.createClient)(__1.proto.ReclaimWitnessDefinition, channel, {});
    return {
        server,
        channel,
        client
    };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getInputParameters() {
    const paramsJsonFile = getCliArgument('json');
    if (!paramsJsonFile) {
        const name = getCliArgument('name');
        const paramsStr = getCliArgument('params');
        const secretParamsStr = getCliArgument('secretParams');
        if (!name || !paramsStr || !secretParamsStr) {
            throw new Error('Either provide --json argument for parameters JSON or provide separately with --name, --params & --secretParams');
        }
        return {
            name,
            params: JSON.parse(paramsStr),
            secretParams: JSON.parse(secretParamsStr)
        };
    }
    let fileContents = await (0, promises_1.readFile)(paramsJsonFile, 'utf8');
    for (const variable in process.env) {
        fileContents = fileContents.replace(`{{${variable}}}`, process.env[variable]);
    }
    return JSON.parse(fileContents);
}
function getCliArgument(arg) {
    const index = process.argv.indexOf(`--${arg}`);
    if (index === -1) {
        return undefined;
    }
    return process.argv[index + 1];
}
main();
