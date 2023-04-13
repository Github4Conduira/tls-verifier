"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMessageProcessor = exports.packWithLength = exports.readWithLength = exports.packWith3ByteLength = exports.packPacket = exports.packPacketHeader = void 0;
const constants_1 = require("./constants");
const wrapped_record_1 = require("./wrapped-record");
function packPacketHeader(dataLength, { type, protoVersion }) {
    const lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16BE(dataLength);
    const buffer = Buffer.concat([
        Buffer.from([constants_1.PACKET_TYPE[type]]),
        protoVersion || constants_1.LEGACY_PROTOCOL_VERSION,
        lengthBuffer
    ]);
    return buffer;
}
exports.packPacketHeader = packPacketHeader;
function packPacket(opts) {
    return Buffer.concat([
        packPacketHeader(opts.data.length, opts),
        opts.data
    ]);
}
exports.packPacket = packPacket;
/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt24 big endian
 */
function packWith3ByteLength(data) {
    return Buffer.concat([
        Buffer.from([0x00]),
        packWithLength(data)
    ]);
}
exports.packWith3ByteLength = packWith3ByteLength;
function readWithLength(data, lengthBytes = 2) {
    const length = lengthBytes === 1
        ? data.readUint8()
        : data.readUInt16BE(lengthBytes === 3 ? 1 : 0);
    if (data.length < lengthBytes + length) {
        throw new Error(`Expected packet to have at least ${length + lengthBytes} bytes, got ${data.length}`);
    }
    return data.slice(lengthBytes, lengthBytes + length);
}
exports.readWithLength = readWithLength;
/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt16 big endian
 */
function packWithLength(data) {
    const buffer = Buffer.alloc(2 + data.length);
    buffer.writeUint16BE(data.length, 0);
    data.copy(buffer, 2);
    return buffer;
}
exports.packWithLength = packWithLength;
const SUPPORTED_PROTO_VERSIONS = [
    constants_1.LEGACY_PROTOCOL_VERSION,
    constants_1.CURRENT_PROTOCOL_VERSION,
];
/**
 * Processes an incoming stream of TLS packets
 */
function makeMessageProcessor(logger) {
    let currentMessageType = undefined;
    let currentMessageHeader = undefined;
    let buffer = Buffer.alloc(0);
    let bytesLeft = 0;
    return {
        /**
         * @param packet TLS packet;
         * can be multiple packets concatenated
         * or incomplete packet
         * or a single packet
         * @param onChunk handle a complete packet
         */
        onData(packet, onChunk) {
            while (packet.length) {
                // if we already aren't processing a packet
                // this is the first byte
                if (!currentMessageType) {
                    // bytes[0] tells us which packet type we're processing
                    // bytes[1:2] tell us the protocol version
                    // bytes[3:4] tell us the length of the packet
                    const packTypeNum = packet[0];
                    currentMessageType = packTypeNum;
                    // get the number of bytes we need to process
                    // to complete the packet
                    bytesLeft = packet.readUInt16BE(3);
                    currentMessageHeader = packet.slice(0, 5);
                    const protoVersion = currentMessageHeader.slice(1, 3);
                    const isSupportedVersion = SUPPORTED_PROTO_VERSIONS.some((v) => v.equals(protoVersion));
                    if (!isSupportedVersion) {
                        throw new Error(`Unsupported protocol version (${protoVersion.toString('hex')})`);
                    }
                    // remove the packet header
                    packet = packet.slice(5);
                    // reset the buffer
                    buffer = Buffer.alloc(0);
                    logger.trace({ bytesLeft, type: currentMessageType }, 'starting processing packet');
                }
                const bytesToRead = Math.min(bytesLeft, packet.length);
                // keep adding to the buffer until we have no bytes left
                buffer = Buffer.concat([
                    buffer,
                    packet.slice(0, bytesToRead)
                ]);
                bytesLeft -= bytesToRead;
                // if we have no bytes left, we have a complete packet
                if (bytesLeft <= 0) {
                    logger.trace({ type: currentMessageType }, 'got complete packet');
                    const packet = {
                        header: currentMessageHeader,
                        content: buffer
                    };
                    if (currentMessageType === constants_1.PACKET_TYPE.WRAPPED_RECORD) {
                        const { encryptedData, authTag } = (0, wrapped_record_1.parseWrappedRecord)(buffer);
                        packet.content = encryptedData;
                        packet.authTag = authTag;
                    }
                    onChunk(currentMessageType, packet);
                    currentMessageType = undefined;
                }
                // if the current chunk we have still has bytes left
                // then that means we have another packet in the chunk
                // this will be processed in the next iteration of the loop
                packet = packet.slice(bytesToRead);
            }
        },
        reset() {
            currentMessageType = undefined;
            currentMessageHeader = undefined;
            buffer = Buffer.alloc(0);
            bytesLeft = 0;
        }
    };
}
exports.makeMessageProcessor = makeMessageProcessor;
