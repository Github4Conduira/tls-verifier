"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const net_1 = require("net");
const packets_1 = require("../tls/packets");
const logger_1 = __importDefault(require("../utils/logger"));
const storage_1 = __importDefault(require("./storage"));
const SESSION_TIMEOUT_MS = 60000;
const generateSessionId = () => (`${Date.now().toString(16).padStart(8, '0')}${(0, crypto_1.randomBytes)(8).toString('hex')}`
    .toUpperCase());
const newSession = async (host, port, attachedData) => {
    const id = generateSessionId();
    const logger = logger_1.default.child({ session: id });
    const socket = new net_1.Socket();
    socket.connect({ host, port });
    const processor = (0, packets_1.makeMessageProcessor)(logger);
    const ttlTimeout = setTimeout(() => {
        if (!socket.readableEnded) {
            onEnd(new Error('timed out'));
        }
        logger.info('clearing session');
        delete storage_1.default[id];
    }, SESSION_TIMEOUT_MS);
    await new Promise((resolve, reject) => {
        socket.once('connect', resolve);
        socket.once('error', reject);
        socket.once('end', () => reject(new Error('connection closed')));
    });
    socket.once('error', onEnd);
    socket.once('end', () => onEnd(undefined));
    logger.debug({ addr: `${host}:${port}` }, 'connected');
    const session = {
        id,
        host,
        port,
        socket,
        transcript: [],
        ttlTimeout,
        logger,
        isActive: true,
        attachedData,
    };
    socket.on('data', data => {
        processor.onData(data, (_, { header, content, authTag }) => {
            const packet = {
                recordHeader: header,
                content,
                authenticationTag: authTag || Buffer.alloc(0)
            };
            session.transcript.push({ sender: 'server', packet });
            socket.emit('server-data', packet);
        });
    });
    storage_1.default[id] = session;
    return session;
    function onEnd(err) {
        if (!session.isActive) {
            return;
        }
        logger.info({ err }, 'session ended');
        socket.end();
        session.isActive = false;
    }
};
exports.default = newSession;
