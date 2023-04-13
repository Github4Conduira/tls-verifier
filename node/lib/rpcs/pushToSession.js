"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const write_to_session_1 = __importDefault(require("../sessions/write-to-session"));
const pushToSession = async ({ sessionId, messages }, {}) => {
    for (const message of messages) {
        await (0, write_to_session_1.default)(sessionId, message);
    }
    return {};
};
exports.default = pushToSession;
