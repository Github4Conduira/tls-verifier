"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTlsAlert = void 0;
const constants_1 = require("./constants");
const ALERT_LEVEL_ENTRIES = Object
    .entries(constants_1.ALERT_LEVEL);
const ALERT_DESCRIPTION_ENTRIES = Object
    .entries(constants_1.ALERT_DESCRIPTION);
/**
 * Parse a TLS alert message
 */
function parseTlsAlert(buffer) {
    var _a, _b;
    const level = buffer.readUInt8(0);
    const description = buffer.readUInt8(1);
    const levelStr = (_a = ALERT_LEVEL_ENTRIES
        .find(([, value]) => value === level)) === null || _a === void 0 ? void 0 : _a[0];
    if (!levelStr) {
        throw new Error(`Unknown alert level ${level}`);
    }
    const descriptionStr = (_b = ALERT_DESCRIPTION_ENTRIES
        .find(([, value]) => value === description)) === null || _b === void 0 ? void 0 : _b[0];
    if (!descriptionStr) {
        throw new Error(`Unknown alert description ${description}`);
    }
    return {
        level: levelStr,
        description: descriptionStr
    };
}
exports.parseTlsAlert = parseTlsAlert;
