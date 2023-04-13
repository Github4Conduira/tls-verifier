"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAPITLSClient = void 0;
const reclaim_zk_1 = require("@questbook/reclaim-zk");
const api_1 = require("../proto/api");
const tls_1 = require("../tls");
const wrapped_record_1 = require("../tls/wrapped-record");
const logger_1 = __importDefault(require("../utils/logger"));
const zk_1 = require("../utils/zk");
const EMPTY_BUFFER = Buffer.alloc(0);
const makeAPITLSClient = ({ host, port, client, redactResponse, request, logger: _logger, additionalConnectOpts, zkParams }) => {
    let sessionId;
    let abort;
    let pendingReveal = false;
    let psk;
    const logger = _logger || (logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.child({}));
    const { generateOutOfBandSession } = additionalConnectOpts || {};
    const blocksToReveal = [];
    const allServerBlocks = [];
    // we'll only support chacha20-poly1305 for API sessions
    const cipherSuites = ['TLS_CHACHA20_POLY1305_SHA256'];
    const tls = (0, tls_1.makeTLSClient)({
        host,
        logger,
        cipherSuites,
        ...additionalConnectOpts || {},
        async write({ header, content, authTag }) {
            if (!sessionId) {
                throw new Error('Too early to write');
            }
            if (pendingReveal && (authTag === null || authTag === void 0 ? void 0 : authTag.length)) {
                const keys = tls.getKeys();
                const key = keys.clientEncKey;
                const iv = (0, wrapped_record_1.generateIV)(keys.clientIv, keys.recordSendCount - 1);
                blocksToReveal.push({
                    authTag,
                    directReveal: {
                        key,
                        iv
                    }
                });
                pendingReveal = false;
            }
            const req = {
                sessionId,
                messages: [
                    {
                        recordHeader: header,
                        content,
                        authenticationTag: authTag || EMPTY_BUFFER
                    }
                ]
            };
            await client.pushToSession(req);
            logger.debug({ sessionId, length: content.length }, 'pushed data');
        }
    });
    async function listenToDataFromServer(result) {
        try {
            for await (const { message } of result) {
                const type = message.recordHeader[0];
                tls.processPacket(type, {
                    header: Buffer.from(message.recordHeader),
                    content: Buffer.from(message.content),
                    authTag: Buffer.from(message.authenticationTag)
                });
            }
        }
        catch (error) {
            if (!error.message.includes('aborted')) {
                throw error;
            }
        }
    }
    async function writeWithReveal(data, reveal) {
        if (!reveal) {
            await tls.updateTrafficKeys();
        }
        if (reveal) {
            pendingReveal = true;
        }
        await tls.write(data);
        if (!reveal) {
            await tls.updateTrafficKeys();
        }
    }
    async function generatePSK() {
        const { Socket } = await Promise.resolve().then(() => __importStar(require('net')));
        const socket = new Socket();
        const tls = (0, tls_1.makeTLSClient)({
            host,
            logger,
            cipherSuites,
            ...additionalConnectOpts || {},
            async write({ header, content, authTag }) {
                socket.write(header);
                socket.write(content);
                if (authTag) {
                    socket.write(authTag);
                }
            }
        });
        socket.once('connect', () => tls.startHandshake());
        socket.on('data', tls.handleRawData);
        socket.connect({ host, port });
        const newPsk = new Promise(resolve => {
            tls.ev.once('session-ticket', ticket => {
                resolve(tls.getPskFromTicket(ticket));
            });
        });
        await new Promise((resolve, reject) => {
            socket.once('error', reject);
            tls.ev.once('handshake', resolve);
        });
        logger.info('waiting for TLS ticket');
        psk = await newPsk;
        logger.info('got TLS ticket, ending session...');
        socket.end();
        tls.end();
    }
    return {
        generatePSK,
        /**
         * handle data received from the server
         * @param clb handle data, return if the block should be revealed or not
         */
        async handleDataFromServer(clb) {
            tls.ev.on('data', handlePlaintext);
            return () => {
                tls.ev.off('data', handlePlaintext);
            };
            function handlePlaintext({ plaintext, ciphertext, authTag }) {
                const keys = tls.getKeys();
                const key = keys.serverEncKey;
                const iv = (0, wrapped_record_1.generateIV)(keys.serverIv, keys.recordRecvCount - 1);
                allServerBlocks.push({
                    authTag,
                    directReveal: { key, iv },
                    plaintext,
                    ciphertext,
                });
                clb(plaintext);
            }
        },
        async connect() {
            if (!psk && generateOutOfBandSession) {
                await generatePSK();
            }
            let initialiseSessionParams = request;
            if (!(initialiseSessionParams === null || initialiseSessionParams === void 0 ? void 0 : initialiseSessionParams.providerClaimRequest)
                && !(initialiseSessionParams === null || initialiseSessionParams === void 0 ? void 0 : initialiseSessionParams.receiptGenerationRequest)) {
                initialiseSessionParams = {
                    receiptGenerationRequest: {
                        host,
                        port
                    },
                    providerClaimRequest: undefined,
                };
            }
            logger.trace('initialising...');
            const res = await client.initialiseSession(initialiseSessionParams);
            sessionId = res.sessionId;
            abort = new AbortController();
            logger.debug({ sessionId }, 'initialised session');
            const pullResult = await client.pullFromSession({ sessionId }, { signal: abort === null || abort === void 0 ? void 0 : abort.signal });
            logger.debug('pulling from session');
            const evPromise = listenToDataFromServer(pullResult);
            tls.startHandshake({ psk });
            await Promise.race([
                evPromise,
                new Promise(resolve => {
                    tls.ev.on('handshake', resolve);
                })
            ]);
            if (!tls.isHandshakeDone()) {
                throw new Error('Handshake failed');
            }
            return () => {
                abort === null || abort === void 0 ? void 0 : abort.abort();
            };
        },
        async cancel() {
            if (!sessionId) {
                throw new Error('Nothing to cancel');
            }
            abort === null || abort === void 0 ? void 0 : abort.abort();
            await client.cancelSession({ sessionId });
            await tls.end();
        },
        async finish() {
            if (!sessionId) {
                throw new Error('Nothing to cancel');
            }
            if (redactResponse) {
                const zkBlocks = await (0, zk_1.prepareZkProofs)({
                    blocks: allServerBlocks,
                    params: zkParams || (0, reclaim_zk_1.loadZKParamsLocally)(),
                    redact: redactResponse,
                    logger,
                });
                // if all blocks should be revealed, reveal them all
                if (zkBlocks === 'all') {
                    blocksToReveal.push(...allServerBlocks);
                }
                else {
                    for (const { block } of zkBlocks) {
                        blocksToReveal.push(block);
                    }
                }
            }
            else {
                blocksToReveal.push(...allServerBlocks);
            }
            abort === null || abort === void 0 ? void 0 : abort.abort();
            const result = await client.finaliseSession({
                sessionId,
                revealBlocks: blocksToReveal,
                cipherSuite: api_1.TlsCipherSuiteType
                    .TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256
            });
            tls.end();
            return result;
        },
        async write(data, redactedSections) {
            for (let i = 0; i < redactedSections.length; i++) {
                const section = redactedSections[i];
                const block = data.slice(0, section.fromIndex);
                if (block.length) {
                    await writeWithReveal(block, true);
                }
                const redacted = data.slice(section.fromIndex, section.toIndex);
                await writeWithReveal(redacted, false);
            }
            const block = data.slice(redactedSections[redactedSections.length - 1].toIndex);
            if (block.length) {
                await writeWithReveal(block, true);
            }
        }
    };
};
exports.makeAPITLSClient = makeAPITLSClient;
