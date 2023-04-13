"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCreateClaim = void 0;
const providers_1 = __importDefault(require("../providers"));
const generate_provider_receipt_1 = require("./generate-provider-receipt");
async function mockCreateClaim({ name, params, secretParams, client, logger, }) {
    const { receipt } = await (0, generate_provider_receipt_1.generateProviderReceipt)({
        name,
        secretParams,
        params,
        client,
        logger,
    });
    const provider = providers_1.default[name];
    await provider.assertValidProviderReceipt(receipt, 
    // @ts-ignore
    params);
    return { receipt };
}
exports.mockCreateClaim = mockCreateClaim;
