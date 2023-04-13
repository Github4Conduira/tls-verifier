"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadZKParamsLocally = void 0;
const path_1 = require("path");
function loadZKParamsLocally() {
    return {
        zkey: {
            data: (0, path_1.join)(__dirname, '../resources/circuit_final.zkey')
        },
        circuitWasm: (0, path_1.join)(__dirname, '../resources/circuit.wasm')
    };
}
exports.loadZKParamsLocally = loadZKParamsLocally;
