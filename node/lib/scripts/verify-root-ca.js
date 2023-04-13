"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const net_1 = require("net");
const tls_1 = require("../tls");
const parse_certificate_1 = require("../tls/parse-certificate");
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
const hostPort = process.argv[2];
async function main() {
    const [host, port] = hostPort.split(':');
    const socket = new net_1.Socket();
    const tls = (0, tls_1.makeTLSClient)({
        host,
        logger: logger_1.default,
        verifyServerCertificate: false,
        async write({ header, content, authTag }) {
            socket.write(header);
            socket.write(content);
            if (authTag) {
                socket.write(authTag);
            }
        }
    });
    tls.ev.on('recv-certificates', ({ certificates }) => {
        logger_1.default.info({ rootIssuer: certificates[certificates.length - 1].internal.issuer }, 'received certificates');
        try {
            (0, parse_certificate_1.verifyCertificateChain)(certificates, host);
            logger_1.default.info('root CA in store. Successfully verified certificate chain');
        }
        catch (err) {
            logger_1.default.error({ err: err.message }, 'root CA likely not in chain');
        }
    });
    tls.ev.on('handshake', () => {
        socket.end();
        tls.end();
    });
    socket.once('connect', () => tls.startHandshake());
    socket.on('data', tls.handleRawData);
    logger_1.default.info(`connecting to ${hostPort}`);
    socket.connect({ host, port: +(port || types_1.DEFAULT_PORT) });
}
exports.main = main;
main();
