"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_session_1 = require("../sessions/assert-session");
const cancelSession = async ({ sessionId }, {}) => {
    const session = (0, assert_session_1.assertSession)(sessionId);
    session.socket.end();
    return {};
};
exports.default = cancelSession;
