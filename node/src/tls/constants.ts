import forge from 'node-forge'

// TLS 1.2 -- used in header of all messages
export const LEGACY_PROTOCOL_VERSION = Buffer.from([ 0x03, 0x03 ])
// TLS 1.3
export const CURRENT_PROTOCOL_VERSION = Buffer.from([ 0x03, 0x04 ])
// no compression, as TLS 1.3 does not support it
export const COMPRESSION_MODE = Buffer.from([ 0x01, 0x00 ])

export const SUPPORTED_KEY_TYPE_MAP = {
	X25519: Buffer.from([ 0x00, 0x1d ]),
}

export const SUPPORTED_RECORD_TYPE_MAP = {
	CLIENT_HELLO: 0x01,
	SERVER_HELLO: 0x02,
	SESSION_TICKET: 0x04,
	ENCRYPTED_EXTENSIONS: 0x08,
	CERTIFICATE: 0x0b,
	CERTIFICATE_REQUEST: 0x0d,
	CERTIFICATE_VERIFY: 0x0f,
	FINISHED: 0x14,
	KEY_UPDATE: 0x18
}

export const CONTENT_TYPE_MAP = {
	CHANGE_CIPHER_SPEC: 0x14,
	ALERT: 0x15,
	HANDSHAKE: 0x16,
	APPLICATION_DATA: 0x17,
}

// The length of AEAD auth tag, appended after encrypted data in wrapped records
export const AUTH_TAG_BYTE_LENGTH = 16

export const SUPPORTED_KEY_TYPES = Object.keys(SUPPORTED_KEY_TYPE_MAP) as (keyof typeof SUPPORTED_KEY_TYPE_MAP)[]

export const SUPPORTED_CIPHER_SUITE_MAP = {
	TLS_CHACHA20_POLY1305_SHA256:{
		identifier:Buffer.from([0x13, 0x03]),
		keyLength: 32,
		hashLength: 32,
		hashAlgorithm: 'sha256',
		cipher: 'chacha20-poly1305'
	},
	TLS_AES_256_GCM_SHA384: {
		identifier: Buffer.from([ 0x13, 0x02 ]),
		keyLength: 32,
		hashLength: 48,
		hashAlgorithm: 'sha384',
		cipher: 'aes-256-gcm',
	},
	TLS_AES_128_GCM_SHA256: {
		identifier: Buffer.from([ 0x13, 0x01 ]),
		keyLength: 16,
		hashLength: 32,
		hashAlgorithm: 'sha256',
		cipher: 'aes-128-gcm',
	},
} as const

export const SUPPORTED_CIPHER_SUITES_ID_MAP = {
	TLS_AES_128_GCM_SHA256: 'aes-128-gcm',
	TLS_AES_256_GCM_SHA384: 'aes-256-gcm',
	TLS_CHACHA20_POLY1305_SHA256:'chacha20-poly1305'
}

export const ALERT_LEVEL = {
	WARNING: 1,
	FATAL: 2,
}

export const ALERT_DESCRIPTION = {
	CLOSE_NOTIFY: 0,
	UNEXPECTED_MESSAGE: 10,
	BAD_RECORD_MAC: 20,
	RECORD_OVERFLOW: 22,
	HANDSHAKE_FAILURE: 40,
	BAD_CERTIFICATE: 42,
	UNSUPPORTED_CERTIFICATE: 43,
	CERTIFICATE_REVOKED: 44,
	CERTIFICATE_EXPIRED: 45,
	CERTIFICATE_UNKNOWN: 46,
	ILLEGAL_PARAMETER: 47,
	UNKNOWN_CA: 48,
	ACCESS_DENIED: 49,
	DECODE_ERROR: 50,
	DECRYPT_ERROR: 51,
	PROTOCOL_VERSION: 70,
	INSUFFICIENT_SECURITY: 71,
	INTERNAL_ERROR: 80,
	INAPPROPRIATE_FALLBACK: 86,
	USER_CANCELED: 90,
	MISSING_EXTENSION: 109,
	UNSUPPORTED_EXTENSION: 110,
	UNRECOGNIZED_NAME: 112,
	BAD_CERTIFICATE_STATUS_RESPONSE: 113,
	UNKNOWN_PSK_IDENTITY: 115,
	CERTIFICATE_REQUIRED: 116,
	NO_APPLICATION_PROTOCOL: 120,
}

export const SUPPORTED_CIPHER_SUITES = Object.keys(SUPPORTED_CIPHER_SUITE_MAP) as (keyof typeof SUPPORTED_CIPHER_SUITE_MAP)[]

type SignatureAlgType = 'RSA_PSS_RSAE_SHA256'
	| 'ED25519'
	| 'RSA_PKCS1_SHA512'

type SupportedSignatureAlg = {
	identifier: Buffer
	verify(data: Buffer, signature: Buffer, publicKey: Buffer | string): boolean
}

export const SUPPORTED_SIGNATURE_ALGS_MAP: { [K in SignatureAlgType]: SupportedSignatureAlg } = {
	RSA_PSS_RSAE_SHA256: {
		identifier: Buffer.from([ 0x08, 0x04 ]),
		verify(data, signature, publicKey) {
			const pubKey = forge.pki.publicKeyFromPem(
				Buffer.isBuffer(publicKey)
					? derToPem(publicKey)
					: publicKey
			)
			const sig = forge.pss.create({
				md: forge.md.sha256.create(),
				mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
				saltLength: 32
			})

			const md = forge.md.sha256.create()
			md.update(data.toString('binary'))
			const dataHashed = md.digest().bytes()
			return pubKey.verify(
				dataHashed,
				signature.toString('binary'),
				sig,
			)

			function derToPem(derBuffer: Buffer) {
				const prefix = '-----BEGIN PUBLIC KEY-----\n'
				const postfix = '-----END PUBLIC KEY-----\n'
				const pemText = prefix + derBuffer.toString('base64').match(/.{0,64}/g)!.join('\n') + postfix
				return pemText
			}
		},
	},
	ED25519: {
		identifier: Buffer.from([ 0x08, 0x07 ]),
		verify() {
			throw new Error('Not implemented')
		}
	},
	RSA_PKCS1_SHA512: {
		identifier: Buffer.from([ 0x06, 0x01 ]),
		verify() {
			throw new Error('Not implemented')
		}
	}
}

export const SUPPORTED_SIGNATURE_ALGS = Object.keys(SUPPORTED_SIGNATURE_ALGS_MAP) as (keyof typeof SUPPORTED_SIGNATURE_ALGS_MAP)[]

export const SUPPORTED_EXTENSION_MAP = {
	SERVER_NAME: 0x00,
	KEY_SHARE: 0x33,
	SUPPORTED_GROUPS: 0x0a,
	SIGNATURE_ALGS: 0x0d,
	SUPPORTED_VERSIONS: 0x2b,
	SESSION_TICKET: 0x23,
	EARLY_DATA: 0x2a,
	PRE_SHARED_KEY: 0x29,
	PRE_SHARED_KEY_MODE: 0x2d,
}

export const SUPPORTED_EXTENSIONS = Object.keys(SUPPORTED_EXTENSION_MAP) as (keyof typeof SUPPORTED_EXTENSION_MAP)[]

export const PACKET_TYPE = {
	HELLO: 0x16,
	WRAPPED_RECORD: 0x17,
	CHANGE_CIPHER_SPEC: 0x14,
	ALERT: 0x15,
}

export const KEY_UPDATE_TYPE_MAP = {
	UPDATE_NOT_REQUESTED: 0,
	UPDATE_REQUESTED: 1
}