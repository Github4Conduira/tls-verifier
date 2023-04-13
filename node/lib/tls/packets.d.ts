/// <reference types="node" />
import { Logger } from 'pino';
import { ProcessPacket } from '../types';
import { PACKET_TYPE } from './constants';
type PacketType = keyof typeof PACKET_TYPE;
type PacketHeaderOptions = {
    type: PacketType;
    protoVersion?: Buffer;
};
export type PacketOptions = {
    type: PacketType;
    protoVersion?: Buffer;
    data: Buffer;
};
export declare function packPacketHeader(dataLength: number, { type, protoVersion }: PacketHeaderOptions): Buffer;
export declare function packPacket(opts: PacketOptions): Buffer;
/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt24 big endian
 */
export declare function packWith3ByteLength(data: Buffer): Buffer;
export declare function readWithLength(data: Buffer, lengthBytes?: number): Buffer;
/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt16 big endian
 */
export declare function packWithLength(data: Buffer): Buffer;
/**
 * Processes an incoming stream of TLS packets
 */
export declare function makeMessageProcessor(logger: Logger): {
    /**
     * @param packet TLS packet;
     * can be multiple packets concatenated
     * or incomplete packet
     * or a single packet
     * @param onChunk handle a complete packet
     */
    onData(packet: Buffer, onChunk: ProcessPacket): void;
    reset(): void;
};
export {};
