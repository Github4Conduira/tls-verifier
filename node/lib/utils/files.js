"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
function readFile(filename) {
    try {
        const { existsSync, readFileSync } = require('fs');
        if (!existsSync(filename)) {
            return;
        }
        const data = readFileSync(filename, 'utf8');
        return data;
    }
    catch (_a) {
    }
}
exports.readFile = readFile;
