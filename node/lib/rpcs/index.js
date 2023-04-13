"use strict";
/** @eslint-disable */
// generated file, run 'yarn generate:rpcs-index' to update
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cancelSession_1 = __importDefault(require("./cancelSession"));
const finaliseSession_1 = __importDefault(require("./finaliseSession"));
const getVerifierPublicKey_1 = __importDefault(require("./getVerifierPublicKey"));
const initialiseSession_1 = __importDefault(require("./initialiseSession"));
const pullFromSession_1 = __importDefault(require("./pullFromSession"));
const pushToSession_1 = __importDefault(require("./pushToSession"));
const rpcs = {
    cancelSession: cancelSession_1.default,
    finaliseSession: finaliseSession_1.default,
    getVerifierPublicKey: getVerifierPublicKey_1.default,
    initialiseSession: initialiseSession_1.default,
    pullFromSession: pullFromSession_1.default,
    pushToSession: pushToSession_1.default,
};
exports.default = rpcs;
