"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertActiveSession = exports.assertSession = void 0;
const generics_1 = require("../utils/generics");
const storage_1 = __importDefault(require("./storage"));
function assertSession(id) {
    const session = storage_1.default[id];
    if (!session) {
        throw new generics_1.ServerError(generics_1.Status.NOT_FOUND, 'session not found');
    }
    return session;
}
exports.assertSession = assertSession;
function assertActiveSession(id) {
    const session = assertSession(id);
    if (!session.isActive) {
        throw new generics_1.ServerError(generics_1.Status.FAILED_PRECONDITION, 'session is not active');
    }
    return session;
}
exports.assertActiveSession = assertActiveSession;
