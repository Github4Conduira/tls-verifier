import { createHmac, randomBytes } from 'crypto'
import { TLSPresharedKey } from '../types'
import { getHash } from '../utils/decryption-utils'
import { COMPRESSION_MODE, CURRENT_PROTOCOL_VERSION, LEGACY_PROTOCOL_VERSION, SUPPORTED_CIPHER_SUITE_MAP, SUPPORTED_EXTENSION_MAP, SUPPORTED_KEY_TYPE_MAP, SUPPORTED_RECORD_TYPE_MAP, SUPPORTED_SIGNATURE_ALGS_MAP } from './constants'
import { packWith3ByteLength, packWithLength } from './packets'

type SupportedKeyType = keyof typeof SUPPORTED_KEY_TYPE_MAP

type ClientHelloOptions = {
	host: string
	publicKey: Buffer
	publicKeyType?: SupportedKeyType
	random?: Buffer
	sessionId?: Buffer
	psk?: TLSPresharedKey
	cipherSuites?: (keyof typeof SUPPORTED_CIPHER_SUITE_MAP)[]
}

type ExtensionData = {
	type: keyof typeof SUPPORTED_EXTENSION_MAP
	data: Buffer
	/** number of bytes to use for length */
	lengthBytes?: number
}

export function packClientHello({
	host,
	sessionId,
	random,
	publicKey,
	publicKeyType,
	psk,
	cipherSuites,
}: ClientHelloOptions) {
	// generate random & sessionId if not provided
	random = random || randomBytes(32)
	sessionId = sessionId || randomBytes(32)

	const packedSessionId = packWithLength(sessionId).slice(1)
	const cipherSuiteList = (cipherSuites || Object.keys(SUPPORTED_CIPHER_SUITE_MAP))
		.map(cipherSuite => SUPPORTED_CIPHER_SUITE_MAP[cipherSuite].identifier)
	const packedCipherSuites = packWithLength(Buffer.concat(cipherSuiteList))
	const extensionsList = [
		packServerNameExtension(host),
		packSupportedGroupsExtension(),
		packSessionTicketExtension(),
		packVersionsExtension(),
		packSignatureAlgorithmsExtension(),
		packPresharedKeyModeExtension(),
		packKeyShareExtension(publicKey, publicKeyType || 'X25519')
	]

	if(psk) {
		extensionsList.push(packPresharedKeyExtension(psk))
	}

	const packedExtensions = packWithLength(Buffer.concat(extensionsList))

	const handshakeData = Buffer.concat([
		LEGACY_PROTOCOL_VERSION,
		random,
		packedSessionId,
		packedCipherSuites,
		COMPRESSION_MODE,
		packedExtensions
	])

	const packedHandshake = Buffer.concat([
		Buffer.from([ SUPPORTED_RECORD_TYPE_MAP.CLIENT_HELLO ]),
		packWith3ByteLength(handshakeData)
	])

	if(psk) {
		const { hashLength } = SUPPORTED_CIPHER_SUITE_MAP[psk.cipherSuite]
		const prefixHandshake = packedHandshake.slice(0, - hashLength - 3)
		const binder = computeBinderSuffix(
			prefixHandshake,
			psk
		)
		binder.copy(packedHandshake, packedHandshake.length - binder.length)
	}

	return packedHandshake
}

export function computeBinderSuffix(packedHandshakePrefix: Buffer, psk: TLSPresharedKey) {
	const { hashAlgorithm } = SUPPORTED_CIPHER_SUITE_MAP[psk.cipherSuite]

	const hashedHelloHandshake = getHash([ packedHandshakePrefix ], psk.cipherSuite)

	const binder = createHmac(hashAlgorithm, psk.finishKey).update(hashedHelloHandshake).digest()
	return binder
}

/**
 * Packs the preshared key extension; the binder is assumed to be 0
 * The empty binder is suffixed to the end of the extension
 * and should be replaced with the correct binder after the full handshake is computed
 */
export function packPresharedKeyExtension({ identity, ticketAge, cipherSuite }: TLSPresharedKey) {
	const binderLength = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite].hashLength

	const packedIdentity = packWithLength(identity)
	const packedTicketAge = Buffer.alloc(4)
	packedTicketAge.writeUInt32BE(ticketAge)

	const serialisedIdentity = Buffer.concat([
		packedIdentity,
		packedTicketAge
	])
	const identityPacked = packWithLength(serialisedIdentity)
	const binderHolderBytes = Buffer.alloc(binderLength + 2 + 1)
	binderHolderBytes.writeUint16BE(binderLength + 1, 0)
	binderHolderBytes.writeUint8(binderLength, 2)

	const total = Buffer.concat([
		identityPacked,
		// 2 bytes for binders
		// 1 byte for each binder length
		binderHolderBytes
	])
	const totalPacked = packWithLength(total)

	const ext = Buffer.alloc(2 + totalPacked.length)
	ext.writeUint16BE(SUPPORTED_EXTENSION_MAP.PRE_SHARED_KEY, 0)
	totalPacked.copy(ext, 2)

	return ext
}

function packPresharedKeyModeExtension() {
	return packExtension({
		type: 'PRE_SHARED_KEY_MODE',
		data: Buffer.from([ 0x00, 0x01 ]),
		lengthBytes: 1
	})
}

function packSessionTicketExtension() {
	return packExtension({
		type: 'SESSION_TICKET',
		data: Buffer.from([])
	})
}

function packVersionsExtension() {
	return packExtension({
		type: 'SUPPORTED_VERSIONS',
		data: CURRENT_PROTOCOL_VERSION,
		lengthBytes: 1
	})
}

function packSignatureAlgorithmsExtension() {
	return packExtension({
		type: 'SIGNATURE_ALGS',
		data: Buffer.concat(
			Object.values(SUPPORTED_SIGNATURE_ALGS_MAP)
				.map(v => v.identifier)
		)
	})
}

function packSupportedGroupsExtension() {
	return packExtension({
		type: 'SUPPORTED_GROUPS',
		// only support ed25519 groups at the moment
		data: Buffer.from([
			0x00, 0x1d,
			0x00, 0x18,
			0x00, 0x17
		])
	})
}

function packKeyShareExtension(publicKey: Buffer, type: SupportedKeyType) {
	return packExtension({
		type: 'KEY_SHARE',
		data: Buffer.concat([
			SUPPORTED_KEY_TYPE_MAP[type],
			packWithLength(publicKey)
		])
	})
}

function packServerNameExtension(host: string) {
	return packExtension({
		type: 'SERVER_NAME',
		data: Buffer.concat([
			// specify that this is a server hostname
			Buffer.from([ 0x0 ]),
			// pack the remaining data prefixed with length
			packWithLength(Buffer.from(host, 'ascii'))
		])
	})
}

function packExtension({ type, data, lengthBytes }: ExtensionData) {
	lengthBytes = lengthBytes || 2
	let packed = data.length ? packWithLength(data) : data
	if(lengthBytes === 1) {
		packed = packed.slice(1)
	}

	// 2 bytes for type, 2 bytes for packed data length
	const result = Buffer.alloc(2 + 2 + packed.length)
	result.writeUint8(SUPPORTED_EXTENSION_MAP[type], 1)
	result.writeUint16BE(packed.length, 2)
	packed.copy(result, 4)

	return result
}