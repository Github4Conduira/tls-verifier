"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclaimBackendDefinition = exports.StartClaimCreationResponse = exports.StartClaimCreationRequest = exports.GetVerificationRequestsResponse = exports.GetVerificationRequestsRequest = exports.FailVerificationRequestResponse = exports.FailVerificationRequestRequest = exports.SucceedVerificationRequestResponse = exports.SucceedVerificationRequestRequest = exports.RejectVerificationRequestResponse = exports.RejectVerificationRequestRequest = exports.AcceptVerificationRequestResponse = exports.AcceptVerificationRequestRequest = exports.CreateVerificationRequestResponse = exports.CreateVerificationRequestRequest = exports.UpdateUserResponse = exports.UpdateUserRequest = exports.CreateLinkResponse = exports.CreateLinkRequest = exports.GetLinksResponse = exports.GetLinksRequest = exports.GetServiceMetadataResponse = exports.GetServiceMetadataRequest = exports.Pagination = exports.VerificationRequest = exports.EncryptedClaimProof = exports.ClaimProof = exports.Link = exports.LinkClaim = exports.verificationRequestStatusToJSON = exports.verificationRequestStatusFromJSON = exports.VerificationRequestStatus = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "reclaim_backend";
var VerificationRequestStatus;
(function (VerificationRequestStatus) {
    /** VERIFICATION_REQUEST_STATUS_PENDING - when then requestor initially asks for verification */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_PENDING"] = 0] = "VERIFICATION_REQUEST_STATUS_PENDING";
    /**
     * VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL - when the claimer has responded,
     * waiting for the requestor to accept/reject the proof
     */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL"] = 1] = "VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL";
    /** VERIFICATION_REQUEST_STATUS_DONE - successfully verified the request */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_DONE"] = 2] = "VERIFICATION_REQUEST_STATUS_DONE";
    /** VERIFICATION_REQUEST_STATUS_EXPIRED - the request expired, either party failed to respond in time */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_EXPIRED"] = 4] = "VERIFICATION_REQUEST_STATUS_EXPIRED";
    /** VERIFICATION_REQUEST_STATUS_FAILED - the requestor failed to provide a valid proof */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_FAILED"] = 5] = "VERIFICATION_REQUEST_STATUS_FAILED";
    /** VERIFICATION_REQUEST_STATUS_REJECTED - claimer rejected the request */
    VerificationRequestStatus[VerificationRequestStatus["VERIFICATION_REQUEST_STATUS_REJECTED"] = 6] = "VERIFICATION_REQUEST_STATUS_REJECTED";
    VerificationRequestStatus[VerificationRequestStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VerificationRequestStatus = exports.VerificationRequestStatus || (exports.VerificationRequestStatus = {}));
function verificationRequestStatusFromJSON(object) {
    switch (object) {
        case 0:
        case "VERIFICATION_REQUEST_STATUS_PENDING":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING;
        case 1:
        case "VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL;
        case 2:
        case "VERIFICATION_REQUEST_STATUS_DONE":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE;
        case 4:
        case "VERIFICATION_REQUEST_STATUS_EXPIRED":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_EXPIRED;
        case 5:
        case "VERIFICATION_REQUEST_STATUS_FAILED":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_FAILED;
        case 6:
        case "VERIFICATION_REQUEST_STATUS_REJECTED":
            return VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VerificationRequestStatus.UNRECOGNIZED;
    }
}
exports.verificationRequestStatusFromJSON = verificationRequestStatusFromJSON;
function verificationRequestStatusToJSON(object) {
    switch (object) {
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING:
            return "VERIFICATION_REQUEST_STATUS_PENDING";
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL:
            return "VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL";
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_DONE:
            return "VERIFICATION_REQUEST_STATUS_DONE";
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_EXPIRED:
            return "VERIFICATION_REQUEST_STATUS_EXPIRED";
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_FAILED:
            return "VERIFICATION_REQUEST_STATUS_FAILED";
        case VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED:
            return "VERIFICATION_REQUEST_STATUS_REJECTED";
        case VerificationRequestStatus.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.verificationRequestStatusToJSON = verificationRequestStatusToJSON;
function createBaseLinkClaim() {
    return {
        id: 0,
        chainId: 0,
        provider: "",
        redactedParameters: "",
        ownerPublicKey: new Uint8Array(),
        timestampS: 0,
        witnessAddresses: [],
    };
}
exports.LinkClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== 0) {
            writer.uint32(8).uint32(message.id);
        }
        if (message.chainId !== 0) {
            writer.uint32(16).uint32(message.chainId);
        }
        if (message.provider !== "") {
            writer.uint32(26).string(message.provider);
        }
        if (message.redactedParameters !== "") {
            writer.uint32(34).string(message.redactedParameters);
        }
        if (message.ownerPublicKey.length !== 0) {
            writer.uint32(42).bytes(message.ownerPublicKey);
        }
        if (message.timestampS !== 0) {
            writer.uint32(48).uint32(message.timestampS);
        }
        for (const v of message.witnessAddresses) {
            writer.uint32(58).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLinkClaim();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.chainId = reader.uint32();
                    break;
                case 3:
                    message.provider = reader.string();
                    break;
                case 4:
                    message.redactedParameters = reader.string();
                    break;
                case 5:
                    message.ownerPublicKey = reader.bytes();
                    break;
                case 6:
                    message.timestampS = reader.uint32();
                    break;
                case 7:
                    message.witnessAddresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? Number(object.id) : 0,
            chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
            provider: isSet(object.provider) ? String(object.provider) : "",
            redactedParameters: isSet(object.redactedParameters) ? String(object.redactedParameters) : "",
            ownerPublicKey: isSet(object.ownerPublicKey) ? bytesFromBase64(object.ownerPublicKey) : new Uint8Array(),
            timestampS: isSet(object.timestampS) ? Number(object.timestampS) : 0,
            witnessAddresses: Array.isArray(object === null || object === void 0 ? void 0 : object.witnessAddresses)
                ? object.witnessAddresses.map((e) => String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = Math.round(message.id));
        message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
        message.provider !== undefined && (obj.provider = message.provider);
        message.redactedParameters !== undefined && (obj.redactedParameters = message.redactedParameters);
        message.ownerPublicKey !== undefined &&
            (obj.ownerPublicKey = base64FromBytes(message.ownerPublicKey !== undefined ? message.ownerPublicKey : new Uint8Array()));
        message.timestampS !== undefined && (obj.timestampS = Math.round(message.timestampS));
        if (message.witnessAddresses) {
            obj.witnessAddresses = message.witnessAddresses.map((e) => e);
        }
        else {
            obj.witnessAddresses = [];
        }
        return obj;
    },
    create(base) {
        return exports.LinkClaim.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseLinkClaim();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : 0;
        message.chainId = (_b = object.chainId) !== null && _b !== void 0 ? _b : 0;
        message.provider = (_c = object.provider) !== null && _c !== void 0 ? _c : "";
        message.redactedParameters = (_d = object.redactedParameters) !== null && _d !== void 0 ? _d : "";
        message.ownerPublicKey = (_e = object.ownerPublicKey) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.timestampS = (_f = object.timestampS) !== null && _f !== void 0 ? _f : 0;
        message.witnessAddresses = ((_g = object.witnessAddresses) === null || _g === void 0 ? void 0 : _g.map((e) => e)) || [];
        return message;
    },
};
function createBaseLink() {
    return { id: "", userId: "", name: "", claims: [], createdAtS: 0, views: 0 };
}
exports.Link = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.userId !== "") {
            writer.uint32(18).string(message.userId);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        for (const v of message.claims) {
            exports.LinkClaim.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.createdAtS !== 0) {
            writer.uint32(40).uint32(message.createdAtS);
        }
        if (message.views !== 0) {
            writer.uint32(48).uint32(message.views);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLink();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.userId = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.claims.push(exports.LinkClaim.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.createdAtS = reader.uint32();
                    break;
                case 6:
                    message.views = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            userId: isSet(object.userId) ? String(object.userId) : "",
            name: isSet(object.name) ? String(object.name) : "",
            claims: Array.isArray(object === null || object === void 0 ? void 0 : object.claims) ? object.claims.map((e) => exports.LinkClaim.fromJSON(e)) : [],
            createdAtS: isSet(object.createdAtS) ? Number(object.createdAtS) : 0,
            views: isSet(object.views) ? Number(object.views) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.userId !== undefined && (obj.userId = message.userId);
        message.name !== undefined && (obj.name = message.name);
        if (message.claims) {
            obj.claims = message.claims.map((e) => e ? exports.LinkClaim.toJSON(e) : undefined);
        }
        else {
            obj.claims = [];
        }
        message.createdAtS !== undefined && (obj.createdAtS = Math.round(message.createdAtS));
        message.views !== undefined && (obj.views = Math.round(message.views));
        return obj;
    },
    create(base) {
        return exports.Link.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseLink();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.userId = (_b = object.userId) !== null && _b !== void 0 ? _b : "";
        message.name = (_c = object.name) !== null && _c !== void 0 ? _c : "";
        message.claims = ((_d = object.claims) === null || _d === void 0 ? void 0 : _d.map((e) => exports.LinkClaim.fromPartial(e))) || [];
        message.createdAtS = (_e = object.createdAtS) !== null && _e !== void 0 ? _e : 0;
        message.views = (_f = object.views) !== null && _f !== void 0 ? _f : 0;
        return message;
    },
};
function createBaseClaimProof() {
    return { parameters: "", signatures: [] };
}
exports.ClaimProof = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.parameters !== "") {
            writer.uint32(18).string(message.parameters);
        }
        for (const v of message.signatures) {
            writer.uint32(26).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClaimProof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.parameters = reader.string();
                    break;
                case 3:
                    message.signatures.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            parameters: isSet(object.parameters) ? String(object.parameters) : "",
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures) ? object.signatures.map((e) => bytesFromBase64(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.parameters !== undefined && (obj.parameters = message.parameters);
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    create(base) {
        return exports.ClaimProof.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseClaimProof();
        message.parameters = (_a = object.parameters) !== null && _a !== void 0 ? _a : "";
        message.signatures = ((_b = object.signatures) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        return message;
    },
};
function createBaseEncryptedClaimProof() {
    return { id: 0, enc: new Uint8Array() };
}
exports.EncryptedClaimProof = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== 0) {
            writer.uint32(8).uint32(message.id);
        }
        if (message.enc.length !== 0) {
            writer.uint32(18).bytes(message.enc);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEncryptedClaimProof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.enc = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? Number(object.id) : 0,
            enc: isSet(object.enc) ? bytesFromBase64(object.enc) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = Math.round(message.id));
        message.enc !== undefined &&
            (obj.enc = base64FromBytes(message.enc !== undefined ? message.enc : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.EncryptedClaimProof.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseEncryptedClaimProof();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : 0;
        message.enc = (_b = object.enc) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseVerificationRequest() {
    return {
        id: "",
        link: undefined,
        context: "",
        status: 0,
        communicationPublicKey: new Uint8Array(),
        communicationSignature: new Uint8Array(),
        requestorId: "",
        createdAtS: 0,
        updatedAtS: 0,
        expiresAtS: 0,
        encryptedClaimProofs: [],
    };
}
exports.VerificationRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.link !== undefined) {
            exports.Link.encode(message.link, writer.uint32(18).fork()).ldelim();
        }
        if (message.context !== "") {
            writer.uint32(26).string(message.context);
        }
        if (message.status !== 0) {
            writer.uint32(32).int32(message.status);
        }
        if (message.communicationPublicKey.length !== 0) {
            writer.uint32(42).bytes(message.communicationPublicKey);
        }
        if (message.communicationSignature.length !== 0) {
            writer.uint32(50).bytes(message.communicationSignature);
        }
        if (message.requestorId !== "") {
            writer.uint32(58).string(message.requestorId);
        }
        if (message.createdAtS !== 0) {
            writer.uint32(64).uint32(message.createdAtS);
        }
        if (message.updatedAtS !== 0) {
            writer.uint32(72).uint32(message.updatedAtS);
        }
        if (message.expiresAtS !== 0) {
            writer.uint32(80).uint32(message.expiresAtS);
        }
        for (const v of message.encryptedClaimProofs) {
            exports.EncryptedClaimProof.encode(v, writer.uint32(90).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVerificationRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.link = exports.Link.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.context = reader.string();
                    break;
                case 4:
                    message.status = reader.int32();
                    break;
                case 5:
                    message.communicationPublicKey = reader.bytes();
                    break;
                case 6:
                    message.communicationSignature = reader.bytes();
                    break;
                case 7:
                    message.requestorId = reader.string();
                    break;
                case 8:
                    message.createdAtS = reader.uint32();
                    break;
                case 9:
                    message.updatedAtS = reader.uint32();
                    break;
                case 10:
                    message.expiresAtS = reader.uint32();
                    break;
                case 11:
                    message.encryptedClaimProofs.push(exports.EncryptedClaimProof.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            link: isSet(object.link) ? exports.Link.fromJSON(object.link) : undefined,
            context: isSet(object.context) ? String(object.context) : "",
            status: isSet(object.status) ? verificationRequestStatusFromJSON(object.status) : 0,
            communicationPublicKey: isSet(object.communicationPublicKey)
                ? bytesFromBase64(object.communicationPublicKey)
                : new Uint8Array(),
            communicationSignature: isSet(object.communicationSignature)
                ? bytesFromBase64(object.communicationSignature)
                : new Uint8Array(),
            requestorId: isSet(object.requestorId) ? String(object.requestorId) : "",
            createdAtS: isSet(object.createdAtS) ? Number(object.createdAtS) : 0,
            updatedAtS: isSet(object.updatedAtS) ? Number(object.updatedAtS) : 0,
            expiresAtS: isSet(object.expiresAtS) ? Number(object.expiresAtS) : 0,
            encryptedClaimProofs: Array.isArray(object === null || object === void 0 ? void 0 : object.encryptedClaimProofs)
                ? object.encryptedClaimProofs.map((e) => exports.EncryptedClaimProof.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.link !== undefined && (obj.link = message.link ? exports.Link.toJSON(message.link) : undefined);
        message.context !== undefined && (obj.context = message.context);
        message.status !== undefined && (obj.status = verificationRequestStatusToJSON(message.status));
        message.communicationPublicKey !== undefined &&
            (obj.communicationPublicKey = base64FromBytes(message.communicationPublicKey !== undefined ? message.communicationPublicKey : new Uint8Array()));
        message.communicationSignature !== undefined &&
            (obj.communicationSignature = base64FromBytes(message.communicationSignature !== undefined ? message.communicationSignature : new Uint8Array()));
        message.requestorId !== undefined && (obj.requestorId = message.requestorId);
        message.createdAtS !== undefined && (obj.createdAtS = Math.round(message.createdAtS));
        message.updatedAtS !== undefined && (obj.updatedAtS = Math.round(message.updatedAtS));
        message.expiresAtS !== undefined && (obj.expiresAtS = Math.round(message.expiresAtS));
        if (message.encryptedClaimProofs) {
            obj.encryptedClaimProofs = message.encryptedClaimProofs.map((e) => e ? exports.EncryptedClaimProof.toJSON(e) : undefined);
        }
        else {
            obj.encryptedClaimProofs = [];
        }
        return obj;
    },
    create(base) {
        return exports.VerificationRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseVerificationRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.link = (object.link !== undefined && object.link !== null) ? exports.Link.fromPartial(object.link) : undefined;
        message.context = (_b = object.context) !== null && _b !== void 0 ? _b : "";
        message.status = (_c = object.status) !== null && _c !== void 0 ? _c : 0;
        message.communicationPublicKey = (_d = object.communicationPublicKey) !== null && _d !== void 0 ? _d : new Uint8Array();
        message.communicationSignature = (_e = object.communicationSignature) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.requestorId = (_f = object.requestorId) !== null && _f !== void 0 ? _f : "";
        message.createdAtS = (_g = object.createdAtS) !== null && _g !== void 0 ? _g : 0;
        message.updatedAtS = (_h = object.updatedAtS) !== null && _h !== void 0 ? _h : 0;
        message.expiresAtS = (_j = object.expiresAtS) !== null && _j !== void 0 ? _j : 0;
        message.encryptedClaimProofs = ((_k = object.encryptedClaimProofs) === null || _k === void 0 ? void 0 : _k.map((e) => exports.EncryptedClaimProof.fromPartial(e))) || [];
        return message;
    },
};
function createBasePagination() {
    return { page: 0, pageSize: 0 };
}
exports.Pagination = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.page !== 0) {
            writer.uint32(8).uint32(message.page);
        }
        if (message.pageSize !== 0) {
            writer.uint32(16).uint32(message.pageSize);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePagination();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.page = reader.uint32();
                    break;
                case 2:
                    message.pageSize = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            page: isSet(object.page) ? Number(object.page) : 0,
            pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.page !== undefined && (obj.page = Math.round(message.page));
        message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
        return obj;
    },
    create(base) {
        return exports.Pagination.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePagination();
        message.page = (_a = object.page) !== null && _a !== void 0 ? _a : 0;
        message.pageSize = (_b = object.pageSize) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseGetServiceMetadataRequest() {
    return {};
}
exports.GetServiceMetadataRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetServiceMetadataRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.GetServiceMetadataRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseGetServiceMetadataRequest();
        return message;
    },
};
function createBaseGetServiceMetadataResponse() {
    return { walletAddress: "" };
}
exports.GetServiceMetadataResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.walletAddress !== "") {
            writer.uint32(10).string(message.walletAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetServiceMetadataResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.walletAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { walletAddress: isSet(object.walletAddress) ? String(object.walletAddress) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.walletAddress !== undefined && (obj.walletAddress = message.walletAddress);
        return obj;
    },
    create(base) {
        return exports.GetServiceMetadataResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetServiceMetadataResponse();
        message.walletAddress = (_a = object.walletAddress) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGetLinksRequest() {
    return { id: "", view: false };
}
exports.GetLinksRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.view === true) {
            writer.uint32(16).bool(message.view);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetLinksRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.view = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { id: isSet(object.id) ? String(object.id) : "", view: isSet(object.view) ? Boolean(object.view) : false };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.view !== undefined && (obj.view = message.view);
        return obj;
    },
    create(base) {
        return exports.GetLinksRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetLinksRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.view = (_b = object.view) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function createBaseGetLinksResponse() {
    return { links: [] };
}
exports.GetLinksResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.links) {
            exports.Link.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetLinksResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.links.push(exports.Link.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { links: Array.isArray(object === null || object === void 0 ? void 0 : object.links) ? object.links.map((e) => exports.Link.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.links) {
            obj.links = message.links.map((e) => e ? exports.Link.toJSON(e) : undefined);
        }
        else {
            obj.links = [];
        }
        return obj;
    },
    create(base) {
        return exports.GetLinksResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetLinksResponse();
        message.links = ((_a = object.links) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Link.fromPartial(e))) || [];
        return message;
    },
};
function createBaseCreateLinkRequest() {
    return { name: "", claims: [] };
}
exports.CreateLinkRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        for (const v of message.claims) {
            exports.LinkClaim.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateLinkRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.claims.push(exports.LinkClaim.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            claims: Array.isArray(object === null || object === void 0 ? void 0 : object.claims) ? object.claims.map((e) => exports.LinkClaim.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        if (message.claims) {
            obj.claims = message.claims.map((e) => e ? exports.LinkClaim.toJSON(e) : undefined);
        }
        else {
            obj.claims = [];
        }
        return obj;
    },
    create(base) {
        return exports.CreateLinkRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCreateLinkRequest();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.claims = ((_b = object.claims) === null || _b === void 0 ? void 0 : _b.map((e) => exports.LinkClaim.fromPartial(e))) || [];
        return message;
    },
};
function createBaseCreateLinkResponse() {
    return { id: "" };
}
exports.CreateLinkResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateLinkResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { id: isSet(object.id) ? String(object.id) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    create(base) {
        return exports.CreateLinkResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseCreateLinkResponse();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseUpdateUserRequest() {
    return { firebaseToken: "" };
}
exports.UpdateUserRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.firebaseToken !== "") {
            writer.uint32(18).string(message.firebaseToken);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateUserRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.firebaseToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { firebaseToken: isSet(object.firebaseToken) ? String(object.firebaseToken) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.firebaseToken !== undefined && (obj.firebaseToken = message.firebaseToken);
        return obj;
    },
    create(base) {
        return exports.UpdateUserRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseUpdateUserRequest();
        message.firebaseToken = (_a = object.firebaseToken) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseUpdateUserResponse() {
    return {};
}
exports.UpdateUserResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateUserResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.UpdateUserResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseUpdateUserResponse();
        return message;
    },
};
function createBaseCreateVerificationRequestRequest() {
    return {
        linkId: "",
        communicationPublicKey: new Uint8Array(),
        communicationSignature: new Uint8Array(),
        context: "",
    };
}
exports.CreateVerificationRequestRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.linkId !== "") {
            writer.uint32(10).string(message.linkId);
        }
        if (message.communicationPublicKey.length !== 0) {
            writer.uint32(18).bytes(message.communicationPublicKey);
        }
        if (message.communicationSignature.length !== 0) {
            writer.uint32(26).bytes(message.communicationSignature);
        }
        if (message.context !== "") {
            writer.uint32(34).string(message.context);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateVerificationRequestRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.linkId = reader.string();
                    break;
                case 2:
                    message.communicationPublicKey = reader.bytes();
                    break;
                case 3:
                    message.communicationSignature = reader.bytes();
                    break;
                case 4:
                    message.context = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            linkId: isSet(object.linkId) ? String(object.linkId) : "",
            communicationPublicKey: isSet(object.communicationPublicKey)
                ? bytesFromBase64(object.communicationPublicKey)
                : new Uint8Array(),
            communicationSignature: isSet(object.communicationSignature)
                ? bytesFromBase64(object.communicationSignature)
                : new Uint8Array(),
            context: isSet(object.context) ? String(object.context) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.linkId !== undefined && (obj.linkId = message.linkId);
        message.communicationPublicKey !== undefined &&
            (obj.communicationPublicKey = base64FromBytes(message.communicationPublicKey !== undefined ? message.communicationPublicKey : new Uint8Array()));
        message.communicationSignature !== undefined &&
            (obj.communicationSignature = base64FromBytes(message.communicationSignature !== undefined ? message.communicationSignature : new Uint8Array()));
        message.context !== undefined && (obj.context = message.context);
        return obj;
    },
    create(base) {
        return exports.CreateVerificationRequestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseCreateVerificationRequestRequest();
        message.linkId = (_a = object.linkId) !== null && _a !== void 0 ? _a : "";
        message.communicationPublicKey = (_b = object.communicationPublicKey) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.communicationSignature = (_c = object.communicationSignature) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.context = (_d = object.context) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseCreateVerificationRequestResponse() {
    return { id: "" };
}
exports.CreateVerificationRequestResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateVerificationRequestResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { id: isSet(object.id) ? String(object.id) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    create(base) {
        return exports.CreateVerificationRequestResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseCreateVerificationRequestResponse();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseAcceptVerificationRequestRequest() {
    return { id: "", encryptedClaimProofs: [] };
}
exports.AcceptVerificationRequestRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        for (const v of message.encryptedClaimProofs) {
            exports.EncryptedClaimProof.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAcceptVerificationRequestRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.encryptedClaimProofs.push(exports.EncryptedClaimProof.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            encryptedClaimProofs: Array.isArray(object === null || object === void 0 ? void 0 : object.encryptedClaimProofs)
                ? object.encryptedClaimProofs.map((e) => exports.EncryptedClaimProof.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        if (message.encryptedClaimProofs) {
            obj.encryptedClaimProofs = message.encryptedClaimProofs.map((e) => e ? exports.EncryptedClaimProof.toJSON(e) : undefined);
        }
        else {
            obj.encryptedClaimProofs = [];
        }
        return obj;
    },
    create(base) {
        return exports.AcceptVerificationRequestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseAcceptVerificationRequestRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.encryptedClaimProofs = ((_b = object.encryptedClaimProofs) === null || _b === void 0 ? void 0 : _b.map((e) => exports.EncryptedClaimProof.fromPartial(e))) || [];
        return message;
    },
};
function createBaseAcceptVerificationRequestResponse() {
    return {};
}
exports.AcceptVerificationRequestResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAcceptVerificationRequestResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.AcceptVerificationRequestResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseAcceptVerificationRequestResponse();
        return message;
    },
};
function createBaseRejectVerificationRequestRequest() {
    return { id: "" };
}
exports.RejectVerificationRequestRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRejectVerificationRequestRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { id: isSet(object.id) ? String(object.id) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    create(base) {
        return exports.RejectVerificationRequestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseRejectVerificationRequestRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseRejectVerificationRequestResponse() {
    return {};
}
exports.RejectVerificationRequestResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRejectVerificationRequestResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.RejectVerificationRequestResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseRejectVerificationRequestResponse();
        return message;
    },
};
function createBaseSucceedVerificationRequestRequest() {
    return { id: "" };
}
exports.SucceedVerificationRequestRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSucceedVerificationRequestRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { id: isSet(object.id) ? String(object.id) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    create(base) {
        return exports.SucceedVerificationRequestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSucceedVerificationRequestRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseSucceedVerificationRequestResponse() {
    return {};
}
exports.SucceedVerificationRequestResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSucceedVerificationRequestResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.SucceedVerificationRequestResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseSucceedVerificationRequestResponse();
        return message;
    },
};
function createBaseFailVerificationRequestRequest() {
    return { id: "", communicationPrivateKey: new Uint8Array() };
}
exports.FailVerificationRequestRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.communicationPrivateKey.length !== 0) {
            writer.uint32(18).bytes(message.communicationPrivateKey);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFailVerificationRequestRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.communicationPrivateKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            communicationPrivateKey: isSet(object.communicationPrivateKey)
                ? bytesFromBase64(object.communicationPrivateKey)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.communicationPrivateKey !== undefined &&
            (obj.communicationPrivateKey = base64FromBytes(message.communicationPrivateKey !== undefined ? message.communicationPrivateKey : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.FailVerificationRequestRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseFailVerificationRequestRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.communicationPrivateKey = (_b = object.communicationPrivateKey) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseFailVerificationRequestResponse() {
    return {};
}
exports.FailVerificationRequestResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFailVerificationRequestResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.FailVerificationRequestResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseFailVerificationRequestResponse();
        return message;
    },
};
function createBaseGetVerificationRequestsRequest() {
    return { id: "", pagination: undefined };
}
exports.GetVerificationRequestsRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVerificationRequestsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetVerificationRequestsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetVerificationRequestsRequest();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseGetVerificationRequestsResponse() {
    return { requests: [], nextPage: 0 };
}
exports.GetVerificationRequestsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.requests) {
            exports.VerificationRequest.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.nextPage !== 0) {
            writer.uint32(16).uint32(message.nextPage);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVerificationRequestsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.requests.push(exports.VerificationRequest.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.nextPage = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            requests: Array.isArray(object === null || object === void 0 ? void 0 : object.requests) ? object.requests.map((e) => exports.VerificationRequest.fromJSON(e)) : [],
            nextPage: isSet(object.nextPage) ? Number(object.nextPage) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.requests) {
            obj.requests = message.requests.map((e) => e ? exports.VerificationRequest.toJSON(e) : undefined);
        }
        else {
            obj.requests = [];
        }
        message.nextPage !== undefined && (obj.nextPage = Math.round(message.nextPage));
        return obj;
    },
    create(base) {
        return exports.GetVerificationRequestsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetVerificationRequestsResponse();
        message.requests = ((_a = object.requests) === null || _a === void 0 ? void 0 : _a.map((e) => exports.VerificationRequest.fromPartial(e))) || [];
        message.nextPage = (_b = object.nextPage) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseStartClaimCreationRequest() {
    return {
        infoHash: new Uint8Array(),
        authorisationSignature: new Uint8Array(),
        expiryTimestampMs: 0,
        captchaToken: "",
    };
}
exports.StartClaimCreationRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.infoHash.length !== 0) {
            writer.uint32(10).bytes(message.infoHash);
        }
        if (message.authorisationSignature.length !== 0) {
            writer.uint32(18).bytes(message.authorisationSignature);
        }
        if (message.expiryTimestampMs !== 0) {
            writer.uint32(24).uint64(message.expiryTimestampMs);
        }
        if (message.captchaToken !== "") {
            writer.uint32(34).string(message.captchaToken);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStartClaimCreationRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.infoHash = reader.bytes();
                    break;
                case 2:
                    message.authorisationSignature = reader.bytes();
                    break;
                case 3:
                    message.expiryTimestampMs = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.captchaToken = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            infoHash: isSet(object.infoHash) ? bytesFromBase64(object.infoHash) : new Uint8Array(),
            authorisationSignature: isSet(object.authorisationSignature)
                ? bytesFromBase64(object.authorisationSignature)
                : new Uint8Array(),
            expiryTimestampMs: isSet(object.expiryTimestampMs) ? Number(object.expiryTimestampMs) : 0,
            captchaToken: isSet(object.captchaToken) ? String(object.captchaToken) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.infoHash !== undefined &&
            (obj.infoHash = base64FromBytes(message.infoHash !== undefined ? message.infoHash : new Uint8Array()));
        message.authorisationSignature !== undefined &&
            (obj.authorisationSignature = base64FromBytes(message.authorisationSignature !== undefined ? message.authorisationSignature : new Uint8Array()));
        message.expiryTimestampMs !== undefined && (obj.expiryTimestampMs = Math.round(message.expiryTimestampMs));
        message.captchaToken !== undefined && (obj.captchaToken = message.captchaToken);
        return obj;
    },
    create(base) {
        return exports.StartClaimCreationRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseStartClaimCreationRequest();
        message.infoHash = (_a = object.infoHash) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.authorisationSignature = (_b = object.authorisationSignature) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.expiryTimestampMs = (_c = object.expiryTimestampMs) !== null && _c !== void 0 ? _c : 0;
        message.captchaToken = (_d = object.captchaToken) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseStartClaimCreationResponse() {
    return { claimId: 0, chainId: 0, witnessHosts: [] };
}
exports.StartClaimCreationResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.claimId !== 0) {
            writer.uint32(8).uint32(message.claimId);
        }
        if (message.chainId !== 0) {
            writer.uint32(16).uint32(message.chainId);
        }
        for (const v of message.witnessHosts) {
            writer.uint32(26).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStartClaimCreationResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claimId = reader.uint32();
                    break;
                case 2:
                    message.chainId = reader.uint32();
                    break;
                case 3:
                    message.witnessHosts.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            claimId: isSet(object.claimId) ? Number(object.claimId) : 0,
            chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
            witnessHosts: Array.isArray(object === null || object === void 0 ? void 0 : object.witnessHosts) ? object.witnessHosts.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.claimId !== undefined && (obj.claimId = Math.round(message.claimId));
        message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
        if (message.witnessHosts) {
            obj.witnessHosts = message.witnessHosts.map((e) => e);
        }
        else {
            obj.witnessHosts = [];
        }
        return obj;
    },
    create(base) {
        return exports.StartClaimCreationResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseStartClaimCreationResponse();
        message.claimId = (_a = object.claimId) !== null && _a !== void 0 ? _a : 0;
        message.chainId = (_b = object.chainId) !== null && _b !== void 0 ? _b : 0;
        message.witnessHosts = ((_c = object.witnessHosts) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        return message;
    },
};
exports.ReclaimBackendDefinition = {
    name: "ReclaimBackend",
    fullName: "reclaim_backend.ReclaimBackend",
    methods: {
        /** Get metadata (including wallet address) about the service */
        getServiceMetadata: {
            name: "GetServiceMetadata",
            requestType: exports.GetServiceMetadataRequest,
            requestStream: false,
            responseType: exports.GetServiceMetadataResponse,
            responseStream: false,
            options: {},
        },
        /** get links created by the user */
        getLinks: {
            name: "GetLinks",
            requestType: exports.GetLinksRequest,
            requestStream: false,
            responseType: exports.GetLinksResponse,
            responseStream: false,
            options: {},
        },
        /** create a new link */
        createLink: {
            name: "CreateLink",
            requestType: exports.CreateLinkRequest,
            requestStream: false,
            responseType: exports.CreateLinkResponse,
            responseStream: false,
            options: {},
        },
        /** request verification for a link */
        createVerificationRequest: {
            name: "CreateVerificationRequest",
            requestType: exports.CreateVerificationRequestRequest,
            requestStream: false,
            responseType: exports.CreateVerificationRequestResponse,
            responseStream: false,
            options: {},
        },
        /** as a claimer, accept a verification request */
        acceptVerificationRequest: {
            name: "AcceptVerificationRequest",
            requestType: exports.AcceptVerificationRequestRequest,
            requestStream: false,
            responseType: exports.AcceptVerificationRequestResponse,
            responseStream: false,
            options: {},
        },
        /** as a claimer, reject a verification request */
        rejectVerificationRequest: {
            name: "RejectVerificationRequest",
            requestType: exports.RejectVerificationRequestRequest,
            requestStream: false,
            responseType: exports.RejectVerificationRequestResponse,
            responseStream: false,
            options: {},
        },
        /** as a requestor, mark the verification request as complete */
        succeedVerificationRequest: {
            name: "SucceedVerificationRequest",
            requestType: exports.SucceedVerificationRequestRequest,
            requestStream: false,
            responseType: exports.SucceedVerificationRequestResponse,
            responseStream: false,
            options: {},
        },
        /**
         * as a requestor, mark the verification request as failed;
         * invalid proof submitted by the claimer
         */
        failVerificationRequest: {
            name: "FailVerificationRequest",
            requestType: exports.FailVerificationRequestRequest,
            requestStream: false,
            responseType: exports.FailVerificationRequestResponse,
            responseStream: false,
            options: {},
        },
        /** get verification requests */
        getVerificationRequests: {
            name: "GetVerificationRequests",
            requestType: exports.GetVerificationRequestsRequest,
            requestStream: false,
            responseType: exports.GetVerificationRequestsResponse,
            responseStream: false,
            options: {},
        },
        /** update your own user */
        updateUser: {
            name: "UpdateUser",
            requestType: exports.UpdateUserRequest,
            requestStream: false,
            responseType: exports.UpdateUserResponse,
            responseStream: false,
            options: {},
        },
        /**
         * start claim creation, sponsored by QB
         * Note: this RPC must be authorised by the wallet
         * that is going to create the claim
         */
        startClaimCreation: {
            name: "StartClaimCreation",
            requestType: exports.StartClaimCreationRequest,
            requestStream: false,
            responseType: exports.StartClaimCreationResponse,
            responseStream: false,
            options: {},
        },
    },
};
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(""));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
