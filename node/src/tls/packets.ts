import { Logger } from 'pino'
import { ProcessPacket, TLSPacket } from '../types'
import { CURRENT_PROTOCOL_VERSION, LEGACY_PROTOCOL_VERSION, PACKET_TYPE } from './constants'
import { parseWrappedRecord } from './wrapped-record'

type PacketType = keyof typeof PACKET_TYPE

type PacketHeaderOptions = {
	type: PacketType
	protoVersion?: Buffer
}

export type PacketOptions = {
	type: PacketType
	protoVersion?: Buffer
	data: Buffer
}

export function packPacketHeader(
	dataLength: number,
	{ type, protoVersion }: PacketHeaderOptions
) {
	const lengthBuffer = Buffer.alloc(2)
	lengthBuffer.writeUInt16BE(dataLength)

	const buffer = Buffer.concat([
		Buffer.from([ PACKET_TYPE[type] ]),
		protoVersion || LEGACY_PROTOCOL_VERSION,
		lengthBuffer
	])

	return buffer
}

export function packPacket(opts: PacketOptions) {
	return Buffer.concat([
		packPacketHeader(opts.data.length, opts),
		opts.data
	])
}

/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt24 big endian
 */
export function packWith3ByteLength(data: Buffer) {
	return Buffer.concat([
		Buffer.from([ 0x00 ]),
		packWithLength(data)
	])
}

export function readWithLength(data: Buffer, lengthBytes = 2) {
	const length = lengthBytes === 1
		? data.readUint8()
		: data.readUInt16BE(lengthBytes === 3 ? 1 : 0)
	if(data.length < lengthBytes + length) {
		throw new Error(`Expected packet to have at least ${length + lengthBytes} bytes, got ${data.length}`)
	}

	return data.slice(lengthBytes, lengthBytes + length)
}

/**
 * Packs data prefixed with the length of the data;
 * Length encoded UInt16 big endian
 */
export function packWithLength(data: Buffer) {
	const buffer = Buffer.alloc(2 + data.length)
	buffer.writeUint16BE(data.length, 0)
	data.copy(buffer, 2)

	return buffer
}

const SUPPORTED_PROTO_VERSIONS = [
	LEGACY_PROTOCOL_VERSION,
	CURRENT_PROTOCOL_VERSION,
]

/**
 * Processes an incoming stream of TLS packets
 */
export function makeMessageProcessor(logger: Logger) {
	let currentMessageType: number | undefined = undefined
	let currentMessageHeader: Buffer | undefined = undefined
	let buffer = Buffer.alloc(0)
	let bytesLeft = 0

	return {
		/**
		 * @param packet TLS packet;
		 * can be multiple packets concatenated
		 * or incomplete packet
		 * or a single packet
		 * @param onChunk handle a complete packet
		 */
		onData(packet: Buffer, onChunk: ProcessPacket) {
			while(packet.length) {
				// if we already aren't processing a packet
				// this is the first byte
				if(!currentMessageType) {
					// bytes[0] tells us which packet type we're processing
					// bytes[1:2] tell us the protocol version
					// bytes[3:4] tell us the length of the packet
					const packTypeNum = packet[0]
					currentMessageType = packTypeNum

					// get the number of bytes we need to process
					// to complete the packet
					bytesLeft = packet.readUInt16BE(3)
					currentMessageHeader = packet.slice(0, 5)

					const protoVersion = currentMessageHeader.slice(1, 3)
					const isSupportedVersion = SUPPORTED_PROTO_VERSIONS.some((v) => v.equals(protoVersion))

					if(!isSupportedVersion) {
						throw new Error(`Unsupported protocol version (${protoVersion.toString('hex')})`)
					}

					// remove the packet header
					packet = packet.slice(5)
					// reset the buffer
					buffer = Buffer.alloc(0)

					logger.trace(
						{ bytesLeft, type: currentMessageType },
						'starting processing packet'
					)
				}

				const bytesToRead = Math.min(bytesLeft, packet.length)
				// keep adding to the buffer until we have no bytes left
				buffer = Buffer.concat([
					buffer,
					packet.slice(0, bytesToRead)
				])
				bytesLeft -= bytesToRead

				// if we have no bytes left, we have a complete packet
				if(bytesLeft <= 0) {
					logger.trace({ type: currentMessageType }, 'got complete packet')
					const packet: TLSPacket = {
						header: currentMessageHeader!,
						content: buffer
					}
					if(currentMessageType === PACKET_TYPE.WRAPPED_RECORD) {
						const { encryptedData, authTag } = parseWrappedRecord(buffer)
						packet.content = encryptedData
						packet.authTag = authTag
					}

					onChunk(currentMessageType, packet)

					currentMessageType = undefined
				}

				// if the current chunk we have still has bytes left
				// then that means we have another packet in the chunk
				// this will be processed in the next iteration of the loop
				packet = packet.slice(bytesToRead)
			}
		},
		reset() {
			currentMessageType = undefined
			currentMessageHeader = undefined
			buffer = Buffer.alloc(0)
			bytesLeft = 0
		}
	}
}