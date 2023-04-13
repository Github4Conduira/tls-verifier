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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGrpcServer = void 0;
const crypto_1 = require("crypto");
const config_1 = require("../config");
const api_1 = require("../proto/api");
const rpcs_1 = __importDefault(require("../rpcs"));
const storage_1 = require("../sessions/storage");
const signatures_1 = require("../signatures");
const generics_1 = require("../utils/generics");
const logger_1 = __importDefault(require("../utils/logger"));
const serverLogger = logger_1.default.child({ stream: 'server' });
async function makeGrpcServer(port = config_1.API_SERVER_PORT) {
    const { createServer } = await Promise.resolve().then(() => __importStar(require('nice-grpc')));
    const server = createServer()
        .use(validateRPC);
    server.add(api_1.ReclaimWitnessDefinition, rpcs_1.default);
    await server.listen(`0.0.0.0:${port}`);
    const publicKey = await signatures_1.SelectedServiceSignature.getPublicKey(config_1.PRIVATE_KEY);
    const address = signatures_1.SelectedServiceSignature.getAddress(publicKey);
    const publicKeyHex = Buffer.from(publicKey).toString('hex');
    serverLogger.info({ port, publicKeyHex, address }, 'booted server');
    return {
        close: async () => {
            await server.shutdown();
            await (0, storage_1.closeAllSessions)();
        }
    };
}
exports.makeGrpcServer = makeGrpcServer;
async function* validateRPC(req, ctx) {
    // last component of path is the RPC name
    const name = req.method.path.split('/').pop();
    const requestId = (0, crypto_1.randomBytes)(4).toString('hex');
    const logger = serverLogger.child({ name, requestId });
    logger.info('started');
    try {
        const result = yield* req.next(req.request, { ...ctx, logger });
        logger.info('finished');
        return result;
    }
    catch (error) {
        logger.error({
            trace: error.stack,
            code: error.code,
            req: req.request,
        }, 'error in RPC');
        if (error instanceof generics_1.ServerError) {
            throw error;
        }
        throw new generics_1.ServerError(generics_1.Status.INTERNAL, `Internal(${error.message})`);
    }
}
