"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclaimWalletBackendClient = void 0;
const reclaim_crypto_sdk_1 = require("@questbookapp/reclaim-crypto-sdk");
const utils_1 = require("ethers/lib/utils");
const api_client_1 = require("../api-client");
const grpc_web_react_native_transport_1 = require("@improbable-eng/grpc-web-react-native-transport");
const grpc_web_1 = require("@improbable-eng/grpc-web");
const transport = (0, grpc_web_react_native_transport_1.ReactNativeTransport)({
    withCredentials: false,
});
grpc_web_1.grpc.setDefaultTransport(transport);
class ReclaimWalletBackendClient {
    constructor(_privateKey) {
        this._privateKey = _privateKey;
        this.getClient = async () => {
            const client = await (0, api_client_1.makeGrpcClient)(this.privateKey);
            return client;
        };
        this.privateKey = _privateKey;
    }
    async updateUser(firebaseToken) {
        const client = await this.getClient();
        try {
            const response = await client.updateUser({ firebaseToken });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async createLink(link) {
        const client = await this.getClient();
        const response = await client.createLink({
            name: link.name,
            claims: link.claims
        });
        return response;
    }
    async getLinks(request) {
        const client = await this.getClient();
        try {
            const response = await client.getLinks({
                id: request.id,
                view: request.view
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async getServiceMetadata() {
        const client = await this.getClient();
        try {
            const response = await client.getServiceMetadata({});
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async startClaimCreation(ephemeralWallet, requestor, infoHash) {
        const { signature, expiryMs } = await (0, reclaim_crypto_sdk_1.authoriseWalletForClaimCreation)(ephemeralWallet, requestor, { infoHash });
        const client = await this.getClient();
        try {
            const response = await client.startClaimCreation({
                infoHash: (0, utils_1.arrayify)(infoHash),
                authorisationSignature: signature,
                expiryTimestampMs: expiryMs,
                captchaToken: ''
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async createVerificationReq(request) {
        const data = (0, reclaim_crypto_sdk_1.createSignDataForCommunicationKey)({
            communicationPublicKey: request.communicationPublicKey,
            linkId: request.linkId,
            context: request.context
        });
        const signature = await reclaim_crypto_sdk_1.signatures.sign(data, this.privateKey);
        const client = await this.getClient();
        try {
            const response = await client.createVerificationRequest({
                linkId: request.linkId,
                communicationPublicKey: request.communicationPublicKey,
                communicationSignature: signature,
                context: request.context
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async getVerificationReq(request) {
        const client = await this.getClient();
        try {
            const response = await client.getVerificationRequests({
                id: request.id,
                pagination: request.pagination
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async acceptVerificationRequest(verificationRequestId, communicationPublicKey, ephemeralPrivateKey, data) {
        const client = await this.getClient();
        let enc = [];
        for (const d of data) {
            const encodedSig = d.signatures.map(s => (0, utils_1.arrayify)(s));
            const encryptedProof = (0, reclaim_crypto_sdk_1.encryptClaimProof)(Buffer.from(communicationPublicKey, 'base64'), (0, utils_1.arrayify)(ephemeralPrivateKey), { parameters: d.parameters, signatures: encodedSig });
            enc.push({
                id: d.id,
                enc: encryptedProof
            });
        }
        try {
            const response = await client.acceptVerificationRequest({
                id: verificationRequestId,
                encryptedClaimProofs: enc
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async succeedVerificationRequest(verificationRequestId) {
        const client = await this.getClient();
        try {
            const response = await client.succeedVerificationRequest({
                id: verificationRequestId
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
    async rejectVerificationRequest(verificationRequestId) {
        const client = await this.getClient();
        try {
            const response = await client.rejectVerificationRequest({
                id: verificationRequestId
            });
            return response;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.ReclaimWalletBackendClient = ReclaimWalletBackendClient;
