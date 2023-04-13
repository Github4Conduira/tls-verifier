"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclaimWitnessDefinition = exports.FinaliseSessionResponse = exports.FinaliseSessionRequest_ZKProof = exports.FinaliseSessionRequest_BlockRevealZk = exports.FinaliseSessionRequest_BlockRevealDirect = exports.FinaliseSessionRequest_Block = exports.FinaliseSessionRequest = exports.CancelSessionResponse = exports.CancelSessionRequest = exports.PullFromSessionResponse = exports.PullFromSessionRequest = exports.PushToSessionResponse = exports.PushToSessionRequest = exports.InitialiseSessionResponse = exports.InitialiseSessionRequest_ProviderClaimRequest = exports.InitialiseSessionRequest_ReceiptGenerationRequest = exports.InitialiseSessionRequest = exports.GetVerifierPublicKeyResponse = exports.GetVerifierPublicKeyRequest = exports.TLSReceipt = exports.ProviderClaimInfo = exports.ProviderClaimData = exports.TranscriptMessage = exports.TLSPacket = exports.serviceSignatureTypeToJSON = exports.serviceSignatureTypeFromJSON = exports.ServiceSignatureType = exports.tlsCipherSuiteTypeToJSON = exports.tlsCipherSuiteTypeFromJSON = exports.TlsCipherSuiteType = exports.transcriptMessageSenderTypeToJSON = exports.transcriptMessageSenderTypeFromJSON = exports.TranscriptMessageSenderType = exports.protobufPackage = void 0;
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "reclaim_witness";
var TranscriptMessageSenderType;
(function (TranscriptMessageSenderType) {
    TranscriptMessageSenderType[TranscriptMessageSenderType["TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN"] = 0] = "TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN";
    TranscriptMessageSenderType[TranscriptMessageSenderType["TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT"] = 1] = "TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT";
    TranscriptMessageSenderType[TranscriptMessageSenderType["TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER"] = 2] = "TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER";
    TranscriptMessageSenderType[TranscriptMessageSenderType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TranscriptMessageSenderType = exports.TranscriptMessageSenderType || (exports.TranscriptMessageSenderType = {}));
function transcriptMessageSenderTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN":
            return TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN;
        case 1:
        case "TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT":
            return TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT;
        case 2:
        case "TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER":
            return TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TranscriptMessageSenderType.UNRECOGNIZED;
    }
}
exports.transcriptMessageSenderTypeFromJSON = transcriptMessageSenderTypeFromJSON;
function transcriptMessageSenderTypeToJSON(object) {
    switch (object) {
        case TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN:
            return "TRANSCRIPT_MESSAGE_SENDER_TYPE_UNKNOWN";
        case TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT:
            return "TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT";
        case TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER:
            return "TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER";
        case TranscriptMessageSenderType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.transcriptMessageSenderTypeToJSON = transcriptMessageSenderTypeToJSON;
var TlsCipherSuiteType;
(function (TlsCipherSuiteType) {
    TlsCipherSuiteType[TlsCipherSuiteType["TLS_CIPHER_SUITE_TYPE_UNKNOWN"] = 0] = "TLS_CIPHER_SUITE_TYPE_UNKNOWN";
    TlsCipherSuiteType[TlsCipherSuiteType["TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256"] = 1] = "TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256";
    TlsCipherSuiteType[TlsCipherSuiteType["TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384"] = 2] = "TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384";
    TlsCipherSuiteType[TlsCipherSuiteType["TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256"] = 3] = "TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256";
    TlsCipherSuiteType[TlsCipherSuiteType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TlsCipherSuiteType = exports.TlsCipherSuiteType || (exports.TlsCipherSuiteType = {}));
function tlsCipherSuiteTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "TLS_CIPHER_SUITE_TYPE_UNKNOWN":
            return TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_UNKNOWN;
        case 1:
        case "TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256":
            return TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256;
        case 2:
        case "TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384":
            return TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384;
        case 3:
        case "TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256":
            return TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256;
        case -1:
        case "UNRECOGNIZED":
        default:
            return TlsCipherSuiteType.UNRECOGNIZED;
    }
}
exports.tlsCipherSuiteTypeFromJSON = tlsCipherSuiteTypeFromJSON;
function tlsCipherSuiteTypeToJSON(object) {
    switch (object) {
        case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_UNKNOWN:
            return "TLS_CIPHER_SUITE_TYPE_UNKNOWN";
        case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256:
            return "TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256";
        case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384:
            return "TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384";
        case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256:
            return "TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256";
        case TlsCipherSuiteType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.tlsCipherSuiteTypeToJSON = tlsCipherSuiteTypeToJSON;
var ServiceSignatureType;
(function (ServiceSignatureType) {
    ServiceSignatureType[ServiceSignatureType["SERVICE_SIGNATURE_TYPE_UNKNOWN"] = 0] = "SERVICE_SIGNATURE_TYPE_UNKNOWN";
    /**
     * SERVICE_SIGNATURE_TYPE_ETH - ETH keys & signature
     * keys: secp256k1
     * signature: ethereum flavor of ECDSA (https://goethereumbook.org/signature-generate/)
     */
    ServiceSignatureType[ServiceSignatureType["SERVICE_SIGNATURE_TYPE_ETH"] = 1] = "SERVICE_SIGNATURE_TYPE_ETH";
    ServiceSignatureType[ServiceSignatureType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ServiceSignatureType = exports.ServiceSignatureType || (exports.ServiceSignatureType = {}));
function serviceSignatureTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "SERVICE_SIGNATURE_TYPE_UNKNOWN":
            return ServiceSignatureType.SERVICE_SIGNATURE_TYPE_UNKNOWN;
        case 1:
        case "SERVICE_SIGNATURE_TYPE_ETH":
            return ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ServiceSignatureType.UNRECOGNIZED;
    }
}
exports.serviceSignatureTypeFromJSON = serviceSignatureTypeFromJSON;
function serviceSignatureTypeToJSON(object) {
    switch (object) {
        case ServiceSignatureType.SERVICE_SIGNATURE_TYPE_UNKNOWN:
            return "SERVICE_SIGNATURE_TYPE_UNKNOWN";
        case ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH:
            return "SERVICE_SIGNATURE_TYPE_ETH";
        case ServiceSignatureType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.serviceSignatureTypeToJSON = serviceSignatureTypeToJSON;
function createBaseTLSPacket() {
    return { recordHeader: new Uint8Array(), content: new Uint8Array(), authenticationTag: new Uint8Array() };
}
exports.TLSPacket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.recordHeader.length !== 0) {
            writer.uint32(10).bytes(message.recordHeader);
        }
        if (message.content.length !== 0) {
            writer.uint32(18).bytes(message.content);
        }
        if (message.authenticationTag.length !== 0) {
            writer.uint32(26).bytes(message.authenticationTag);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTLSPacket();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.recordHeader = reader.bytes();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.content = reader.bytes();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.authenticationTag = reader.bytes();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            recordHeader: isSet(object.recordHeader) ? bytesFromBase64(object.recordHeader) : new Uint8Array(),
            content: isSet(object.content) ? bytesFromBase64(object.content) : new Uint8Array(),
            authenticationTag: isSet(object.authenticationTag) ? bytesFromBase64(object.authenticationTag) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.recordHeader !== undefined &&
            (obj.recordHeader = base64FromBytes(message.recordHeader !== undefined ? message.recordHeader : new Uint8Array()));
        message.content !== undefined &&
            (obj.content = base64FromBytes(message.content !== undefined ? message.content : new Uint8Array()));
        message.authenticationTag !== undefined &&
            (obj.authenticationTag = base64FromBytes(message.authenticationTag !== undefined ? message.authenticationTag : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.TLSPacket.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseTLSPacket();
        message.recordHeader = (_a = object.recordHeader) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.content = (_b = object.content) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.authenticationTag = (_c = object.authenticationTag) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseTranscriptMessage() {
    return { senderType: 0, redacted: false, message: new Uint8Array() };
}
exports.TranscriptMessage = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.senderType !== 0) {
            writer.uint32(8).int32(message.senderType);
        }
        if (message.redacted === true) {
            writer.uint32(16).bool(message.redacted);
        }
        if (message.message.length !== 0) {
            writer.uint32(26).bytes(message.message);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTranscriptMessage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 8) {
                        break;
                    }
                    message.senderType = reader.int32();
                    continue;
                case 2:
                    if (tag != 16) {
                        break;
                    }
                    message.redacted = reader.bool();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.message = reader.bytes();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            senderType: isSet(object.senderType) ? transcriptMessageSenderTypeFromJSON(object.senderType) : 0,
            redacted: isSet(object.redacted) ? Boolean(object.redacted) : false,
            message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.senderType !== undefined && (obj.senderType = transcriptMessageSenderTypeToJSON(message.senderType));
        message.redacted !== undefined && (obj.redacted = message.redacted);
        message.message !== undefined &&
            (obj.message = base64FromBytes(message.message !== undefined ? message.message : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.TranscriptMessage.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseTranscriptMessage();
        message.senderType = (_a = object.senderType) !== null && _a !== void 0 ? _a : 0;
        message.redacted = (_b = object.redacted) !== null && _b !== void 0 ? _b : false;
        message.message = (_c = object.message) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseProviderClaimData() {
    return { provider: "", parameters: "", owner: "", timestampS: 0, claimId: 0, context: "" };
}
exports.ProviderClaimData = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.provider !== "") {
            writer.uint32(10).string(message.provider);
        }
        if (message.parameters !== "") {
            writer.uint32(18).string(message.parameters);
        }
        if (message.owner !== "") {
            writer.uint32(26).string(message.owner);
        }
        if (message.timestampS !== 0) {
            writer.uint32(32).uint32(message.timestampS);
        }
        if (message.claimId !== 0) {
            writer.uint32(40).uint32(message.claimId);
        }
        if (message.context !== "") {
            writer.uint32(50).string(message.context);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProviderClaimData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.provider = reader.string();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.parameters = reader.string();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.owner = reader.string();
                    continue;
                case 4:
                    if (tag != 32) {
                        break;
                    }
                    message.timestampS = reader.uint32();
                    continue;
                case 5:
                    if (tag != 40) {
                        break;
                    }
                    message.claimId = reader.uint32();
                    continue;
                case 6:
                    if (tag != 50) {
                        break;
                    }
                    message.context = reader.string();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            provider: isSet(object.provider) ? String(object.provider) : "",
            parameters: isSet(object.parameters) ? String(object.parameters) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
            timestampS: isSet(object.timestampS) ? Number(object.timestampS) : 0,
            claimId: isSet(object.claimId) ? Number(object.claimId) : 0,
            context: isSet(object.context) ? String(object.context) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.provider !== undefined && (obj.provider = message.provider);
        message.parameters !== undefined && (obj.parameters = message.parameters);
        message.owner !== undefined && (obj.owner = message.owner);
        message.timestampS !== undefined && (obj.timestampS = Math.round(message.timestampS));
        message.claimId !== undefined && (obj.claimId = Math.round(message.claimId));
        message.context !== undefined && (obj.context = message.context);
        return obj;
    },
    create(base) {
        return exports.ProviderClaimData.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseProviderClaimData();
        message.provider = (_a = object.provider) !== null && _a !== void 0 ? _a : "";
        message.parameters = (_b = object.parameters) !== null && _b !== void 0 ? _b : "";
        message.owner = (_c = object.owner) !== null && _c !== void 0 ? _c : "";
        message.timestampS = (_d = object.timestampS) !== null && _d !== void 0 ? _d : 0;
        message.claimId = (_e = object.claimId) !== null && _e !== void 0 ? _e : 0;
        message.context = (_f = object.context) !== null && _f !== void 0 ? _f : "";
        return message;
    },
};
function createBaseProviderClaimInfo() {
    return { provider: "", parameters: "", context: "" };
}
exports.ProviderClaimInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.provider !== "") {
            writer.uint32(10).string(message.provider);
        }
        if (message.parameters !== "") {
            writer.uint32(18).string(message.parameters);
        }
        if (message.context !== "") {
            writer.uint32(50).string(message.context);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProviderClaimInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.provider = reader.string();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.parameters = reader.string();
                    continue;
                case 6:
                    if (tag != 50) {
                        break;
                    }
                    message.context = reader.string();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            provider: isSet(object.provider) ? String(object.provider) : "",
            parameters: isSet(object.parameters) ? String(object.parameters) : "",
            context: isSet(object.context) ? String(object.context) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.provider !== undefined && (obj.provider = message.provider);
        message.parameters !== undefined && (obj.parameters = message.parameters);
        message.context !== undefined && (obj.context = message.context);
        return obj;
    },
    create(base) {
        return exports.ProviderClaimInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseProviderClaimInfo();
        message.provider = (_a = object.provider) !== null && _a !== void 0 ? _a : "";
        message.parameters = (_b = object.parameters) !== null && _b !== void 0 ? _b : "";
        message.context = (_c = object.context) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseTLSReceipt() {
    return { hostPort: "", timestampS: 0, transcript: [], signature: new Uint8Array() };
}
exports.TLSReceipt = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.hostPort !== "") {
            writer.uint32(10).string(message.hostPort);
        }
        if (message.timestampS !== 0) {
            writer.uint32(16).uint32(message.timestampS);
        }
        for (const v of message.transcript) {
            exports.TranscriptMessage.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(34).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTLSReceipt();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.hostPort = reader.string();
                    continue;
                case 2:
                    if (tag != 16) {
                        break;
                    }
                    message.timestampS = reader.uint32();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.transcript.push(exports.TranscriptMessage.decode(reader, reader.uint32()));
                    continue;
                case 4:
                    if (tag != 34) {
                        break;
                    }
                    message.signature = reader.bytes();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            hostPort: isSet(object.hostPort) ? String(object.hostPort) : "",
            timestampS: isSet(object.timestampS) ? Number(object.timestampS) : 0,
            transcript: Array.isArray(object === null || object === void 0 ? void 0 : object.transcript)
                ? object.transcript.map((e) => exports.TranscriptMessage.fromJSON(e))
                : [],
            signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.hostPort !== undefined && (obj.hostPort = message.hostPort);
        message.timestampS !== undefined && (obj.timestampS = Math.round(message.timestampS));
        if (message.transcript) {
            obj.transcript = message.transcript.map((e) => e ? exports.TranscriptMessage.toJSON(e) : undefined);
        }
        else {
            obj.transcript = [];
        }
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.TLSReceipt.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseTLSReceipt();
        message.hostPort = (_a = object.hostPort) !== null && _a !== void 0 ? _a : "";
        message.timestampS = (_b = object.timestampS) !== null && _b !== void 0 ? _b : 0;
        message.transcript = ((_c = object.transcript) === null || _c === void 0 ? void 0 : _c.map((e) => exports.TranscriptMessage.fromPartial(e))) || [];
        message.signature = (_d = object.signature) !== null && _d !== void 0 ? _d : new Uint8Array();
        return message;
    },
};
function createBaseGetVerifierPublicKeyRequest() {
    return {};
}
exports.GetVerifierPublicKeyRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVerifierPublicKeyRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
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
        return exports.GetVerifierPublicKeyRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseGetVerifierPublicKeyRequest();
        return message;
    },
};
function createBaseGetVerifierPublicKeyResponse() {
    return { publicKey: new Uint8Array(), signatureType: 0 };
}
exports.GetVerifierPublicKeyResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.publicKey.length !== 0) {
            writer.uint32(10).bytes(message.publicKey);
        }
        if (message.signatureType !== 0) {
            writer.uint32(16).int32(message.signatureType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVerifierPublicKeyResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.publicKey = reader.bytes();
                    continue;
                case 2:
                    if (tag != 16) {
                        break;
                    }
                    message.signatureType = reader.int32();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            publicKey: isSet(object.publicKey) ? bytesFromBase64(object.publicKey) : new Uint8Array(),
            signatureType: isSet(object.signatureType) ? serviceSignatureTypeFromJSON(object.signatureType) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.publicKey !== undefined &&
            (obj.publicKey = base64FromBytes(message.publicKey !== undefined ? message.publicKey : new Uint8Array()));
        message.signatureType !== undefined && (obj.signatureType = serviceSignatureTypeToJSON(message.signatureType));
        return obj;
    },
    create(base) {
        return exports.GetVerifierPublicKeyResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetVerifierPublicKeyResponse();
        message.publicKey = (_a = object.publicKey) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.signatureType = (_b = object.signatureType) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseInitialiseSessionRequest() {
    return { receiptGenerationRequest: undefined, providerClaimRequest: undefined };
}
exports.InitialiseSessionRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.receiptGenerationRequest !== undefined) {
            exports.InitialiseSessionRequest_ReceiptGenerationRequest.encode(message.receiptGenerationRequest, writer.uint32(10).fork()).ldelim();
        }
        if (message.providerClaimRequest !== undefined) {
            exports.InitialiseSessionRequest_ProviderClaimRequest.encode(message.providerClaimRequest, writer.uint32(18).fork())
                .ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInitialiseSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.receiptGenerationRequest = exports.InitialiseSessionRequest_ReceiptGenerationRequest.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.providerClaimRequest = exports.InitialiseSessionRequest_ProviderClaimRequest.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            receiptGenerationRequest: isSet(object.receiptGenerationRequest)
                ? exports.InitialiseSessionRequest_ReceiptGenerationRequest.fromJSON(object.receiptGenerationRequest)
                : undefined,
            providerClaimRequest: isSet(object.providerClaimRequest)
                ? exports.InitialiseSessionRequest_ProviderClaimRequest.fromJSON(object.providerClaimRequest)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.receiptGenerationRequest !== undefined && (obj.receiptGenerationRequest = message.receiptGenerationRequest
            ? exports.InitialiseSessionRequest_ReceiptGenerationRequest.toJSON(message.receiptGenerationRequest)
            : undefined);
        message.providerClaimRequest !== undefined && (obj.providerClaimRequest = message.providerClaimRequest
            ? exports.InitialiseSessionRequest_ProviderClaimRequest.toJSON(message.providerClaimRequest)
            : undefined);
        return obj;
    },
    create(base) {
        return exports.InitialiseSessionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseInitialiseSessionRequest();
        message.receiptGenerationRequest =
            (object.receiptGenerationRequest !== undefined && object.receiptGenerationRequest !== null)
                ? exports.InitialiseSessionRequest_ReceiptGenerationRequest.fromPartial(object.receiptGenerationRequest)
                : undefined;
        message.providerClaimRequest = (object.providerClaimRequest !== undefined && object.providerClaimRequest !== null)
            ? exports.InitialiseSessionRequest_ProviderClaimRequest.fromPartial(object.providerClaimRequest)
            : undefined;
        return message;
    },
};
function createBaseInitialiseSessionRequest_ReceiptGenerationRequest() {
    return { host: "", port: 0 };
}
exports.InitialiseSessionRequest_ReceiptGenerationRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.host !== "") {
            writer.uint32(10).string(message.host);
        }
        if (message.port !== 0) {
            writer.uint32(16).uint32(message.port);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInitialiseSessionRequest_ReceiptGenerationRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.host = reader.string();
                    continue;
                case 2:
                    if (tag != 16) {
                        break;
                    }
                    message.port = reader.uint32();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { host: isSet(object.host) ? String(object.host) : "", port: isSet(object.port) ? Number(object.port) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.host !== undefined && (obj.host = message.host);
        message.port !== undefined && (obj.port = Math.round(message.port));
        return obj;
    },
    create(base) {
        return exports.InitialiseSessionRequest_ReceiptGenerationRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseInitialiseSessionRequest_ReceiptGenerationRequest();
        message.host = (_a = object.host) !== null && _a !== void 0 ? _a : "";
        message.port = (_b = object.port) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseInitialiseSessionRequest_ProviderClaimRequest() {
    return { chainId: 0, claimId: 0, info: undefined };
}
exports.InitialiseSessionRequest_ProviderClaimRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.chainId !== 0) {
            writer.uint32(8).uint32(message.chainId);
        }
        if (message.claimId !== 0) {
            writer.uint32(16).uint32(message.claimId);
        }
        if (message.info !== undefined) {
            exports.ProviderClaimInfo.encode(message.info, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInitialiseSessionRequest_ProviderClaimRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 8) {
                        break;
                    }
                    message.chainId = reader.uint32();
                    continue;
                case 2:
                    if (tag != 16) {
                        break;
                    }
                    message.claimId = reader.uint32();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.info = exports.ProviderClaimInfo.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
            claimId: isSet(object.claimId) ? Number(object.claimId) : 0,
            info: isSet(object.info) ? exports.ProviderClaimInfo.fromJSON(object.info) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
        message.claimId !== undefined && (obj.claimId = Math.round(message.claimId));
        message.info !== undefined && (obj.info = message.info ? exports.ProviderClaimInfo.toJSON(message.info) : undefined);
        return obj;
    },
    create(base) {
        return exports.InitialiseSessionRequest_ProviderClaimRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseInitialiseSessionRequest_ProviderClaimRequest();
        message.chainId = (_a = object.chainId) !== null && _a !== void 0 ? _a : 0;
        message.claimId = (_b = object.claimId) !== null && _b !== void 0 ? _b : 0;
        message.info = (object.info !== undefined && object.info !== null)
            ? exports.ProviderClaimInfo.fromPartial(object.info)
            : undefined;
        return message;
    },
};
function createBaseInitialiseSessionResponse() {
    return { sessionId: "" };
}
exports.InitialiseSessionResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sessionId !== "") {
            writer.uint32(10).string(message.sessionId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInitialiseSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.sessionId = reader.string();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { sessionId: isSet(object.sessionId) ? String(object.sessionId) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.sessionId !== undefined && (obj.sessionId = message.sessionId);
        return obj;
    },
    create(base) {
        return exports.InitialiseSessionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseInitialiseSessionResponse();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBasePushToSessionRequest() {
    return { sessionId: "", messages: [] };
}
exports.PushToSessionRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sessionId !== "") {
            writer.uint32(10).string(message.sessionId);
        }
        for (const v of message.messages) {
            exports.TLSPacket.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePushToSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.sessionId = reader.string();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.messages.push(exports.TLSPacket.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            sessionId: isSet(object.sessionId) ? String(object.sessionId) : "",
            messages: Array.isArray(object === null || object === void 0 ? void 0 : object.messages) ? object.messages.map((e) => exports.TLSPacket.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.sessionId !== undefined && (obj.sessionId = message.sessionId);
        if (message.messages) {
            obj.messages = message.messages.map((e) => e ? exports.TLSPacket.toJSON(e) : undefined);
        }
        else {
            obj.messages = [];
        }
        return obj;
    },
    create(base) {
        return exports.PushToSessionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePushToSessionRequest();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : "";
        message.messages = ((_b = object.messages) === null || _b === void 0 ? void 0 : _b.map((e) => exports.TLSPacket.fromPartial(e))) || [];
        return message;
    },
};
function createBasePushToSessionResponse() {
    return {};
}
exports.PushToSessionResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePushToSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
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
        return exports.PushToSessionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBasePushToSessionResponse();
        return message;
    },
};
function createBasePullFromSessionRequest() {
    return { sessionId: "" };
}
exports.PullFromSessionRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sessionId !== "") {
            writer.uint32(10).string(message.sessionId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePullFromSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.sessionId = reader.string();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { sessionId: isSet(object.sessionId) ? String(object.sessionId) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.sessionId !== undefined && (obj.sessionId = message.sessionId);
        return obj;
    },
    create(base) {
        return exports.PullFromSessionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePullFromSessionRequest();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBasePullFromSessionResponse() {
    return { message: undefined };
}
exports.PullFromSessionResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.message !== undefined) {
            exports.TLSPacket.encode(message.message, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePullFromSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.message = exports.TLSPacket.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { message: isSet(object.message) ? exports.TLSPacket.fromJSON(object.message) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.message !== undefined && (obj.message = message.message ? exports.TLSPacket.toJSON(message.message) : undefined);
        return obj;
    },
    create(base) {
        return exports.PullFromSessionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBasePullFromSessionResponse();
        message.message = (object.message !== undefined && object.message !== null)
            ? exports.TLSPacket.fromPartial(object.message)
            : undefined;
        return message;
    },
};
function createBaseCancelSessionRequest() {
    return { sessionId: "" };
}
exports.CancelSessionRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sessionId !== "") {
            writer.uint32(10).string(message.sessionId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCancelSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.sessionId = reader.string();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { sessionId: isSet(object.sessionId) ? String(object.sessionId) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.sessionId !== undefined && (obj.sessionId = message.sessionId);
        return obj;
    },
    create(base) {
        return exports.CancelSessionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseCancelSessionRequest();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseCancelSessionResponse() {
    return {};
}
exports.CancelSessionResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCancelSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
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
        return exports.CancelSessionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseCancelSessionResponse();
        return message;
    },
};
function createBaseFinaliseSessionRequest() {
    return { sessionId: "", revealBlocks: [], cipherSuite: 0 };
}
exports.FinaliseSessionRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sessionId !== "") {
            writer.uint32(10).string(message.sessionId);
        }
        for (const v of message.revealBlocks) {
            exports.FinaliseSessionRequest_Block.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.cipherSuite !== 0) {
            writer.uint32(24).int32(message.cipherSuite);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.sessionId = reader.string();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.revealBlocks.push(exports.FinaliseSessionRequest_Block.decode(reader, reader.uint32()));
                    continue;
                case 3:
                    if (tag != 24) {
                        break;
                    }
                    message.cipherSuite = reader.int32();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            sessionId: isSet(object.sessionId) ? String(object.sessionId) : "",
            revealBlocks: Array.isArray(object === null || object === void 0 ? void 0 : object.revealBlocks)
                ? object.revealBlocks.map((e) => exports.FinaliseSessionRequest_Block.fromJSON(e))
                : [],
            cipherSuite: isSet(object.cipherSuite) ? tlsCipherSuiteTypeFromJSON(object.cipherSuite) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.sessionId !== undefined && (obj.sessionId = message.sessionId);
        if (message.revealBlocks) {
            obj.revealBlocks = message.revealBlocks.map((e) => e ? exports.FinaliseSessionRequest_Block.toJSON(e) : undefined);
        }
        else {
            obj.revealBlocks = [];
        }
        message.cipherSuite !== undefined && (obj.cipherSuite = tlsCipherSuiteTypeToJSON(message.cipherSuite));
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseFinaliseSessionRequest();
        message.sessionId = (_a = object.sessionId) !== null && _a !== void 0 ? _a : "";
        message.revealBlocks = ((_b = object.revealBlocks) === null || _b === void 0 ? void 0 : _b.map((e) => exports.FinaliseSessionRequest_Block.fromPartial(e))) || [];
        message.cipherSuite = (_c = object.cipherSuite) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseFinaliseSessionRequest_Block() {
    return {
        authTag: new Uint8Array(),
        key: new Uint8Array(),
        iv: new Uint8Array(),
        directReveal: undefined,
        zkReveal: undefined,
    };
}
exports.FinaliseSessionRequest_Block = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.authTag.length !== 0) {
            writer.uint32(10).bytes(message.authTag);
        }
        if (message.key.length !== 0) {
            writer.uint32(18).bytes(message.key);
        }
        if (message.iv.length !== 0) {
            writer.uint32(26).bytes(message.iv);
        }
        if (message.directReveal !== undefined) {
            exports.FinaliseSessionRequest_BlockRevealDirect.encode(message.directReveal, writer.uint32(34).fork()).ldelim();
        }
        if (message.zkReveal !== undefined) {
            exports.FinaliseSessionRequest_BlockRevealZk.encode(message.zkReveal, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionRequest_Block();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.authTag = reader.bytes();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.key = reader.bytes();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.iv = reader.bytes();
                    continue;
                case 4:
                    if (tag != 34) {
                        break;
                    }
                    message.directReveal = exports.FinaliseSessionRequest_BlockRevealDirect.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag != 42) {
                        break;
                    }
                    message.zkReveal = exports.FinaliseSessionRequest_BlockRevealZk.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            authTag: isSet(object.authTag) ? bytesFromBase64(object.authTag) : new Uint8Array(),
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            iv: isSet(object.iv) ? bytesFromBase64(object.iv) : new Uint8Array(),
            directReveal: isSet(object.directReveal)
                ? exports.FinaliseSessionRequest_BlockRevealDirect.fromJSON(object.directReveal)
                : undefined,
            zkReveal: isSet(object.zkReveal) ? exports.FinaliseSessionRequest_BlockRevealZk.fromJSON(object.zkReveal) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.authTag !== undefined &&
            (obj.authTag = base64FromBytes(message.authTag !== undefined ? message.authTag : new Uint8Array()));
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.iv !== undefined && (obj.iv = base64FromBytes(message.iv !== undefined ? message.iv : new Uint8Array()));
        message.directReveal !== undefined && (obj.directReveal = message.directReveal
            ? exports.FinaliseSessionRequest_BlockRevealDirect.toJSON(message.directReveal)
            : undefined);
        message.zkReveal !== undefined &&
            (obj.zkReveal = message.zkReveal ? exports.FinaliseSessionRequest_BlockRevealZk.toJSON(message.zkReveal) : undefined);
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionRequest_Block.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseFinaliseSessionRequest_Block();
        message.authTag = (_a = object.authTag) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.key = (_b = object.key) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.iv = (_c = object.iv) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.directReveal = (object.directReveal !== undefined && object.directReveal !== null)
            ? exports.FinaliseSessionRequest_BlockRevealDirect.fromPartial(object.directReveal)
            : undefined;
        message.zkReveal = (object.zkReveal !== undefined && object.zkReveal !== null)
            ? exports.FinaliseSessionRequest_BlockRevealZk.fromPartial(object.zkReveal)
            : undefined;
        return message;
    },
};
function createBaseFinaliseSessionRequest_BlockRevealDirect() {
    return { key: new Uint8Array(), iv: new Uint8Array() };
}
exports.FinaliseSessionRequest_BlockRevealDirect = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        if (message.iv.length !== 0) {
            writer.uint32(18).bytes(message.iv);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionRequest_BlockRevealDirect();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.key = reader.bytes();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.iv = reader.bytes();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            iv: isSet(object.iv) ? bytesFromBase64(object.iv) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.iv !== undefined && (obj.iv = base64FromBytes(message.iv !== undefined ? message.iv : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionRequest_BlockRevealDirect.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseFinaliseSessionRequest_BlockRevealDirect();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.iv = (_b = object.iv) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseFinaliseSessionRequest_BlockRevealZk() {
    return { proofs: [] };
}
exports.FinaliseSessionRequest_BlockRevealZk = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.proofs) {
            exports.FinaliseSessionRequest_ZKProof.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionRequest_BlockRevealZk();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.proofs.push(exports.FinaliseSessionRequest_ZKProof.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            proofs: Array.isArray(object === null || object === void 0 ? void 0 : object.proofs)
                ? object.proofs.map((e) => exports.FinaliseSessionRequest_ZKProof.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.proofs) {
            obj.proofs = message.proofs.map((e) => e ? exports.FinaliseSessionRequest_ZKProof.toJSON(e) : undefined);
        }
        else {
            obj.proofs = [];
        }
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionRequest_BlockRevealZk.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseFinaliseSessionRequest_BlockRevealZk();
        message.proofs = ((_a = object.proofs) === null || _a === void 0 ? void 0 : _a.map((e) => exports.FinaliseSessionRequest_ZKProof.fromPartial(e))) || [];
        return message;
    },
};
function createBaseFinaliseSessionRequest_ZKProof() {
    return {
        proofJson: "",
        decryptedRedactedCiphertext: new Uint8Array(),
        redactedPlaintext: new Uint8Array(),
        startIdx: 0,
    };
}
exports.FinaliseSessionRequest_ZKProof = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proofJson !== "") {
            writer.uint32(10).string(message.proofJson);
        }
        if (message.decryptedRedactedCiphertext.length !== 0) {
            writer.uint32(18).bytes(message.decryptedRedactedCiphertext);
        }
        if (message.redactedPlaintext.length !== 0) {
            writer.uint32(26).bytes(message.redactedPlaintext);
        }
        if (message.startIdx !== 0) {
            writer.uint32(32).uint32(message.startIdx);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionRequest_ZKProof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.proofJson = reader.string();
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.decryptedRedactedCiphertext = reader.bytes();
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.redactedPlaintext = reader.bytes();
                    continue;
                case 4:
                    if (tag != 32) {
                        break;
                    }
                    message.startIdx = reader.uint32();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            proofJson: isSet(object.proofJson) ? String(object.proofJson) : "",
            decryptedRedactedCiphertext: isSet(object.decryptedRedactedCiphertext)
                ? bytesFromBase64(object.decryptedRedactedCiphertext)
                : new Uint8Array(),
            redactedPlaintext: isSet(object.redactedPlaintext) ? bytesFromBase64(object.redactedPlaintext) : new Uint8Array(),
            startIdx: isSet(object.startIdx) ? Number(object.startIdx) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.proofJson !== undefined && (obj.proofJson = message.proofJson);
        message.decryptedRedactedCiphertext !== undefined &&
            (obj.decryptedRedactedCiphertext = base64FromBytes(message.decryptedRedactedCiphertext !== undefined ? message.decryptedRedactedCiphertext : new Uint8Array()));
        message.redactedPlaintext !== undefined &&
            (obj.redactedPlaintext = base64FromBytes(message.redactedPlaintext !== undefined ? message.redactedPlaintext : new Uint8Array()));
        message.startIdx !== undefined && (obj.startIdx = Math.round(message.startIdx));
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionRequest_ZKProof.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseFinaliseSessionRequest_ZKProof();
        message.proofJson = (_a = object.proofJson) !== null && _a !== void 0 ? _a : "";
        message.decryptedRedactedCiphertext = (_b = object.decryptedRedactedCiphertext) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.redactedPlaintext = (_c = object.redactedPlaintext) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.startIdx = (_d = object.startIdx) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
function createBaseFinaliseSessionResponse() {
    return { receipt: undefined, claimData: undefined, signature: new Uint8Array() };
}
exports.FinaliseSessionResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.receipt !== undefined) {
            exports.TLSReceipt.encode(message.receipt, writer.uint32(10).fork()).ldelim();
        }
        if (message.claimData !== undefined) {
            exports.ProviderClaimData.encode(message.claimData, writer.uint32(18).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(26).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : minimal_1.default.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFinaliseSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag != 10) {
                        break;
                    }
                    message.receipt = exports.TLSReceipt.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag != 18) {
                        break;
                    }
                    message.claimData = exports.ProviderClaimData.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag != 26) {
                        break;
                    }
                    message.signature = reader.bytes();
                    continue;
            }
            if ((tag & 7) == 4 || tag == 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            receipt: isSet(object.receipt) ? exports.TLSReceipt.fromJSON(object.receipt) : undefined,
            claimData: isSet(object.claimData) ? exports.ProviderClaimData.fromJSON(object.claimData) : undefined,
            signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.receipt !== undefined && (obj.receipt = message.receipt ? exports.TLSReceipt.toJSON(message.receipt) : undefined);
        message.claimData !== undefined &&
            (obj.claimData = message.claimData ? exports.ProviderClaimData.toJSON(message.claimData) : undefined);
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.FinaliseSessionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseFinaliseSessionResponse();
        message.receipt = (object.receipt !== undefined && object.receipt !== null)
            ? exports.TLSReceipt.fromPartial(object.receipt)
            : undefined;
        message.claimData = (object.claimData !== undefined && object.claimData !== null)
            ? exports.ProviderClaimData.fromPartial(object.claimData)
            : undefined;
        message.signature = (_a = object.signature) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
exports.ReclaimWitnessDefinition = {
    name: "ReclaimWitness",
    fullName: "reclaim_witness.ReclaimWitness",
    methods: {
        /** get the x25519 public key of the verifier that can be used to verify authenticity of receipts & credentials */
        getVerifierPublicKey: {
            name: "GetVerifierPublicKey",
            requestType: exports.GetVerifierPublicKeyRequest,
            requestStream: false,
            responseType: exports.GetVerifierPublicKeyResponse,
            responseStream: false,
            options: {},
        },
        /** initialise a new TLS verification session with the verifier */
        initialiseSession: {
            name: "initialiseSession",
            requestType: exports.InitialiseSessionRequest,
            requestStream: false,
            responseType: exports.InitialiseSessionResponse,
            responseStream: false,
            options: {},
        },
        /** push blocks to the session */
        pushToSession: {
            name: "PushToSession",
            requestType: exports.PushToSessionRequest,
            requestStream: false,
            responseType: exports.PushToSessionResponse,
            responseStream: false,
            options: {},
        },
        /** listen to blocks from the session */
        pullFromSession: {
            name: "PullFromSession",
            requestType: exports.PullFromSessionRequest,
            requestStream: false,
            responseType: exports.PullFromSessionResponse,
            responseStream: true,
            options: {},
        },
        /** cancel and destroy the session */
        cancelSession: {
            name: "CancelSession",
            requestType: exports.CancelSessionRequest,
            requestStream: false,
            responseType: exports.CancelSessionResponse,
            responseStream: false,
            options: {},
        },
        /** finalise the session, and generate the receipt & provider signature */
        finaliseSession: {
            name: "FinaliseSession",
            requestType: exports.FinaliseSessionRequest,
            requestStream: false,
            responseType: exports.FinaliseSessionResponse,
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
function isSet(value) {
    return value !== null && value !== undefined;
}
