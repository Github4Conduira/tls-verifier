"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTLSClient = void 0;
const crypto_1 = require("crypto");
const events_1 = __importDefault(require("events"));
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const utils_3 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const make_queue_1 = require("../utils/make-queue");
const client_hello_1 = require("./client-hello");
const constants_1 = require("./constants");
const finish_messages_1 = require("./finish-messages");
const key_update_1 = require("./key-update");
const packets_1 = require("./packets");
const parse_alert_1 = require("./parse-alert");
const parse_certificate_1 = require("./parse-certificate");
const parse_server_hello_1 = require("./parse-server-hello");
const session_ticket_1 = require("./session-ticket");
const wrapped_record_1 = require("./wrapped-record");
const RECORD_LENGTH_BYTES = 3;
function makeTLSClient({ host, verifyServerCertificate, rootCAs, logger: _logger, cipherSuites, crypto, write }) {
    verifyServerCertificate = verifyServerCertificate !== false;
    const logger = _logger || (logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.child({}));
    const ev = new events_1.default();
    const keyPair = (0, utils_3.generateX25519KeyPair)();
    const processor = (0, packets_1.makeMessageProcessor)(logger);
    const { enqueue: enqueueServerPacket } = (0, make_queue_1.makeQueue)();
    let handshakeDone = false;
    let ended = false;
    let sessionId = Buffer.alloc(0);
    let handshakeMsgs = [];
    let cipherSuite = undefined;
    let earlySecret = undefined;
    let keys = undefined;
    let recordSendCount = 0;
    let recordRecvCount = 0;
    let certificates = [];
    const processPacket = (type, { header, content, authTag }) => {
        return enqueueServerPacket(async () => {
            if (ended) {
                logger.warn('connection closed, ignoring packet');
                return;
            }
            let data = content;
            let contentType;
            let ciphertext;
            switch (type) {
                case constants_1.PACKET_TYPE.HELLO:
                    break;
                case constants_1.PACKET_TYPE.WRAPPED_RECORD:
                    logger.trace('recv wrapped record');
                    const decrypted = (0, wrapped_record_1.decryptWrappedRecord)(content, {
                        authTag,
                        key: keys.serverEncKey,
                        iv: keys.serverIv,
                        recordHeader: header,
                        recordNumber: recordRecvCount,
                        cipherSuite: cipherSuite,
                        crypto,
                    });
                    data = decrypted.plaintext;
                    // exclude final byte (content type)
                    ciphertext = content.slice(0, -1);
                    contentType = decrypted.contentType;
                    logger.debug({ recordRecvCount, contentType: contentType.toString(16) }, 'decrypted wrapped record');
                    recordRecvCount += 1;
                    break;
                case constants_1.PACKET_TYPE.CHANGE_CIPHER_SPEC:
                    // TLS 1.3 doesn't really have a change cipher spec
                    // this is just for compatibility with TLS 1.2
                    // so we do nothing here, and return
                    return;
                case constants_1.PACKET_TYPE.ALERT:
                    const { level, description } = (0, parse_alert_1.parseTlsAlert)(content);
                    logger[level === 'WARNING' ? 'warn' : 'error']({ level, description }, 'received alert');
                    if (level === 'FATAL') {
                        end();
                    }
                    return;
                default:
                    logger.warn({ type: type.toString(16), chunk: (0, utils_2.toHexStringWithWhitespace)(content) }, 'cannot process message');
                    return;
            }
            try {
                await processRecord({
                    record: data,
                    contentType,
                    authTag,
                    ciphertext,
                });
            }
            catch (err) {
                logger.error({ err }, 'error processing record');
                ev.emit('error', err);
                end();
            }
        });
    };
    async function processRecord({ record, contentType, authTag, ciphertext }) {
        if (!contentType || contentType === constants_1.CONTENT_TYPE_MAP.HANDSHAKE) {
            let data = readPacket();
            while (data) {
                const { type, content } = data;
                switch (type) {
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.SERVER_HELLO:
                        logger.trace('received server hello');
                        const hello = (0, parse_server_hello_1.parseServerHello)(content);
                        const masterKey = (0, utils_1.computeSharedMasterKey)(keyPair.privKey, hello.publicKey);
                        if (!hello.supportsPsk && earlySecret) {
                            throw new Error('Server does not support PSK');
                        }
                        cipherSuite = hello.cipherSuite;
                        keys = (0, utils_1.computeSharedKeys)({
                            hellos: handshakeMsgs,
                            cipherSuite: hello.cipherSuite,
                            secretType: 'hs',
                            masterSecret: masterKey,
                            earlySecret,
                        });
                        logger.debug({ cipherSuite }, 'processed server hello & computed shared keys');
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.ENCRYPTED_EXTENSIONS:
                        logger.debug({ len: content.length }, 'received encrypted extensions');
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.CERTIFICATE:
                        logger.debug({ len: content.length }, 'received certificate');
                        const result = (0, parse_certificate_1.parseCertificates)(content);
                        certificates = result.certificates;
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.CERTIFICATE_VERIFY:
                        logger.debug({ len: content.length }, 'received certificate verify');
                        const signature = (0, parse_certificate_1.parseServerCertificateVerify)(content);
                        if (!certificates.length) {
                            throw new Error('No certificates received');
                        }
                        await (0, parse_certificate_1.verifyCertificateSignature)({
                            ...signature,
                            publicKey: certificates[0].getPublicKey(),
                            hellos: handshakeMsgs.slice(0, -1),
                            cipherSuite: cipherSuite
                        });
                        ev.emit('recv-certificates', { certificates });
                        if (verifyServerCertificate) {
                            await (0, parse_certificate_1.verifyCertificateChain)(certificates, host, rootCAs);
                        }
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.FINISHED:
                        await processServerFinish(content);
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.KEY_UPDATE:
                        const newMasterSecret = (0, utils_1.computeUpdatedTrafficMasterSecret)(keys.serverSecret, cipherSuite);
                        const newKeys = (0, utils_1.deriveTrafficKeysForSide)(newMasterSecret, cipherSuite);
                        keys = {
                            ...keys,
                            serverSecret: newMasterSecret,
                            serverEncKey: newKeys.encKey,
                            serverIv: newKeys.iv,
                        };
                        recordRecvCount = 0;
                        logger.debug('updated server traffic keys');
                        break;
                    case constants_1.SUPPORTED_RECORD_TYPE_MAP.SESSION_TICKET:
                        logger.debug({ len: record.length }, 'received session ticket');
                        const ticket = (0, session_ticket_1.parseSessionTicket)(content);
                        ev.emit('session-ticket', ticket);
                        break;
                    default:
                        logger.warn({ type: type.toString(16) }, 'cannot process record');
                        break;
                }
                data = readPacket();
            }
            function readPacket() {
                if (!record.length) {
                    return;
                }
                const type = record[0];
                const lengthBytes = RECORD_LENGTH_BYTES;
                const content = (0, packets_1.readWithLength)(record.slice(1), lengthBytes);
                const totalLength = 1 + lengthBytes + content.length;
                if (!handshakeDone) {
                    handshakeMsgs.push(record.slice(0, totalLength));
                }
                record = record.slice(totalLength);
                return { type, content };
            }
        }
        else if (contentType === constants_1.CONTENT_TYPE_MAP.APPLICATION_DATA) {
            logger.trace({ len: record.length }, 'received application data');
            ev.emit('data', {
                plaintext: record,
                authTag: authTag,
                ciphertext: ciphertext,
            });
        }
        else if (contentType === constants_1.CONTENT_TYPE_MAP.ALERT) {
            logger.error({ record }, 'recv alert');
        }
        else {
            logger.warn({ record: record.toString('hex'), contentType: contentType.toString(16) }, 'cannot process record');
        }
    }
    async function processServerFinish(serverFinish) {
        logger.debug('received finished');
        // the server hash computation does not include
        // the server finish, so we need to exclude it
        const handshakeMsgsForServerHash = handshakeMsgs.slice(0, -1);
        (0, finish_messages_1.verifyFinishMessage)(serverFinish, {
            secret: keys.serverSecret,
            handshakeMessages: handshakeMsgsForServerHash,
            cipherSuite: cipherSuite
        });
        logger.debug('server finish verified');
        const clientFinish = (0, finish_messages_1.packFinishMessagePacket)({
            secret: keys.clientSecret,
            handshakeMessages: handshakeMsgs,
            cipherSuite: cipherSuite
        });
        logger.trace({ finish: (0, utils_2.toHexStringWithWhitespace)(clientFinish) }, 'sending client finish');
        await writeEncryptedPacket({
            type: 'WRAPPED_RECORD',
            data: clientFinish,
            contentType: 'HANDSHAKE'
        });
        // switch to using the provider keys
        keys = (0, utils_1.computeSharedKeys)({
            // we only use handshake messages till the server finish
            hellos: handshakeMsgs,
            cipherSuite: cipherSuite,
            secretType: 'ap',
            masterSecret: keys.masterSecret,
        });
        // also the send/recv counters are reset
        // once we switch to the provider keys
        recordSendCount = 0;
        recordRecvCount = 0;
        // add the client finish to the handshake messages
        handshakeMsgs.push(clientFinish);
        handshakeDone = true;
        ev.emit('handshake', undefined);
    }
    async function writeEncryptedPacket(opts) {
        // total length = data len + 1 byte for record type + auth tag len
        const dataLen = opts.data.length + 1 + constants_1.AUTH_TAG_BYTE_LENGTH;
        const header = (0, packets_1.packPacketHeader)(dataLen, opts);
        logger.trace({ recordSendCount, contentType: opts.contentType }, 'sending enc data');
        const { ciphertext, authTag } = (0, wrapped_record_1.encryptWrappedRecord)({ plaintext: opts.data, contentType: opts.contentType }, {
            key: keys.clientEncKey,
            iv: keys.clientIv,
            recordHeader: header,
            recordNumber: recordSendCount,
            cipherSuite: cipherSuite,
            crypto
        });
        recordSendCount += 1;
        await write({ header, content: ciphertext, authTag });
    }
    async function writePacket(opts) {
        const header = (0, packets_1.packPacketHeader)(opts.data.length, opts);
        await write({ header, content: opts.data });
    }
    async function end() {
        await enqueueServerPacket(() => { });
        handshakeDone = false;
        handshakeMsgs = [];
        cipherSuite = undefined;
        keys = undefined;
        recordSendCount = 0;
        recordRecvCount = 0;
        earlySecret = undefined;
        processor.reset();
        ended = true;
    }
    return {
        ev,
        hasEnded() {
            return ended;
        },
        getKeyPair() {
            return keyPair;
        },
        getKeys() {
            if (!keys) {
                return undefined;
            }
            return { ...keys, recordSendCount, recordRecvCount };
        },
        getSessionId() {
            return sessionId;
        },
        isHandshakeDone() {
            return handshakeDone;
        },
        getPskFromTicket(ticket) {
            return (0, session_ticket_1.getPskFromTicket)(ticket, {
                masterKey: keys.masterSecret,
                hellos: handshakeMsgs,
                cipherSuite: cipherSuite,
            });
        },
        async startHandshake(opts) {
            if (handshakeDone) {
                throw new Error('Handshake already done');
            }
            sessionId = (0, crypto_1.randomBytes)(32);
            ended = false;
            const clientHello = (0, client_hello_1.packClientHello)({
                host,
                publicKey: keyPair.pubKey,
                random: (opts === null || opts === void 0 ? void 0 : opts.random) || (0, crypto_1.randomBytes)(32),
                sessionId,
                psk: opts === null || opts === void 0 ? void 0 : opts.psk,
                cipherSuites
            });
            handshakeMsgs.push(clientHello);
            if (opts === null || opts === void 0 ? void 0 : opts.psk) {
                earlySecret = opts.psk.earlySecret;
            }
            logger.trace({ hello: (0, utils_2.toHexStringWithWhitespace)(clientHello) }, 'sent client hello');
            await writePacket({
                type: 'HELLO',
                data: clientHello,
            });
        },
        handleRawData(data) {
            if (ended) {
                return;
            }
            processor.onData(data, processPacket);
        },
        async updateTrafficKeys(requestUpdateFromServer = false) {
            const packet = (0, key_update_1.packKeyUpdateRecord)(requestUpdateFromServer
                ? 'UPDATE_REQUESTED'
                : 'UPDATE_NOT_REQUESTED');
            await writeEncryptedPacket({
                data: packet,
                type: 'WRAPPED_RECORD',
                contentType: 'HANDSHAKE'
            });
            const newMasterSecret = (0, utils_1.computeUpdatedTrafficMasterSecret)(keys.clientSecret, cipherSuite);
            const newKeys = (0, utils_1.deriveTrafficKeysForSide)(newMasterSecret, cipherSuite);
            keys = {
                ...keys,
                clientSecret: newMasterSecret,
                clientEncKey: newKeys.encKey,
                clientIv: newKeys.iv,
            };
            recordSendCount = 0;
            logger.info('updated client traffic keys');
        },
        processPacket,
        write(data) {
            if (!handshakeDone) {
                throw new Error('Handshake not done');
            }
            return writeEncryptedPacket({
                type: 'WRAPPED_RECORD',
                data,
                contentType: 'APPLICATION_DATA'
            });
        },
        end,
    };
}
exports.makeTLSClient = makeTLSClient;
