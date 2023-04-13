"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAllSessions = void 0;
const storage = {};
function closeAllSessions() {
    for (const session of Object.values(storage)) {
        session.socket.end();
        clearTimeout(session.ttlTimeout);
    }
}
exports.closeAllSessions = closeAllSessions;
exports.default = storage;
