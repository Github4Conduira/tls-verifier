import { createCipheriv, createDecipheriv, createHash } from 'crypto'
import { expand, extract } from 'futoin-hkdf'
import { AUTH_TAG_BYTE_LENGTH, SUPPORTED_CIPHER_SUITE_MAP } from '../tls/constants'
import { packWithLength } from '../tls/packets'
import { TLSCrypto } from '../types'
import { calculateSharedKey } from './x25519'

type DeriveTrafficKeysOptions = {
	masterSecret: Buffer
	/** used to derive keys when resuming session */
	earlySecret?: Buffer

	cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP
	/** list of handshake message to hash; or the hash itself */
	hellos: Buffer[] | Buffer
	/** type of secret; handshake or provider-data */
	secretType: 'hs' | 'ap'
}

export const NODEJS_TLS_CRYPTO: TLSCrypto = {
	encrypt(cipherSuite, { key, iv, data, aead }) {
		const { cipher } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]

		const encryptr = createCipheriv(
			cipher,
			key,
			iv,
			// @ts-expect-error
			{ authTagLength: AUTH_TAG_BYTE_LENGTH }
		)
		encryptr.setAutoPadding(false)
		encryptr.setAAD(aead, { plaintextLength: data.length })

		const ciphertext = Buffer.concat([
			encryptr.update(data),
			encryptr.final()
		])
		const authTag = encryptr.getAuthTag()

		return { ciphertext, authTag }
	},
	decrypt(cipherSuite, { key, iv, data, aead, authTag }) {
		const { cipher } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]
		const decipher = createDecipheriv(
			cipher,
			key,
			iv,
			// @ts-expect-error
			{ authTagLength: AUTH_TAG_BYTE_LENGTH }
		)
		decipher.setAutoPadding(false)
		if(authTag) {
			decipher.setAuthTag(authTag)
		}

		decipher.setAAD(aead, { plaintextLength: data.length })

		const plaintext = Buffer.concat([
			decipher.update(data),
			// essentially, we skip validating the data
			// if we don't have an auth tag
			// this is insecure generally, and auth tag validation
			// should happen at some point
			authTag ? decipher.final() : Buffer.alloc(0),
		])

		return { plaintext }
	}
}

export type SharedKeyData = ReturnType<typeof computeSharedKeys>

export function computeSharedMasterKey(
	clientPrivateKey: Buffer,
	serverPublicKey: Buffer
) {
	return calculateSharedKey(serverPublicKey, clientPrivateKey)
}

export function computeUpdatedTrafficMasterSecret(masterSecret: Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP) {
	const { hashAlgorithm, hashLength } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]
	return hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'traffic upd', Buffer.alloc(0), hashLength)
}

export function computeSharedKeys({
	hellos,
	masterSecret: masterKey,
	cipherSuite,
	secretType,
	earlySecret
}: DeriveTrafficKeysOptions) {
	const { hashAlgorithm, hashLength } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]

	const emptyHash = createHash(hashAlgorithm).update('').digest()
	const zeros = Buffer.alloc(hashLength)
	let handshakeTrafficSecret: Buffer
	if(secretType === 'hs') {
		// some hashes
		earlySecret = earlySecret || extract(hashAlgorithm, hashLength, zeros, '')
		const derivedSecret = hkdfExtractAndExpandLabel(hashAlgorithm, earlySecret, 'derived', emptyHash, hashLength)

		handshakeTrafficSecret = extract(hashAlgorithm, hashLength, masterKey, derivedSecret)
	} else {
		const derivedSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterKey, 'derived', emptyHash, hashLength)
		handshakeTrafficSecret = extract(hashAlgorithm, hashLength, zeros, derivedSecret)
	}

	return deriveTrafficKeys({
		hellos,
		cipherSuite,
		masterSecret: handshakeTrafficSecret,
		secretType
	})
}

export function deriveTrafficKeys({
	masterSecret,
	cipherSuite,
	hellos,
	secretType,
}: DeriveTrafficKeysOptions) {
	const { hashAlgorithm, hashLength } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]

	const handshakeHash = getHash(hellos, cipherSuite)

	const clientSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, `c ${secretType} traffic`, handshakeHash, hashLength)
	const serverSecret = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, `s ${secretType} traffic`, handshakeHash, hashLength)
	const { encKey: clientEncKey, iv: clientIv } = deriveTrafficKeysForSide(clientSecret, cipherSuite)
	const { encKey: serverEncKey, iv: serverIv } = deriveTrafficKeysForSide(serverSecret, cipherSuite)

	return {
		masterSecret,
		clientSecret,
		serverSecret,
		clientEncKey,
		serverEncKey,
		clientIv,
		serverIv
	}
}

export function deriveTrafficKeysForSide(masterSecret: Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP) {
	const { hashAlgorithm, keyLength } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]
	const ivLen = 12

	const encKey = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'key', Buffer.alloc(0), keyLength)
	const iv = hkdfExtractAndExpandLabel(hashAlgorithm, masterSecret, 'iv', Buffer.alloc(0), ivLen)

	return { masterSecret, encKey, iv }
}

export function hkdfExtractAndExpandLabel(algorithm: string, key: ArrayBufferLike, label: string, context: ArrayBufferLike, length: number) {
	const tmpLabel = `tls13 ${label}`
	const lengthBuffer = Buffer.alloc(2)
	lengthBuffer.writeUInt16BE(length, 0)
	const hkdfLabel = Buffer.concat([
		lengthBuffer,
		packWithLength(Buffer.from(tmpLabel)).slice(1),
		packWithLength(Buffer.from(context)).slice(1)
	])

	return expand(algorithm, length, Buffer.from(key), length, hkdfLabel)
}

export function getHash(msgs: Buffer[] | Buffer, cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP) {
	if(Array.isArray(msgs)) {
		const { hashAlgorithm } = SUPPORTED_CIPHER_SUITE_MAP[cipherSuite]
		const hasher = createHash(hashAlgorithm)
		for(const msg of msgs) {
			hasher.update(msg)
		}

		return hasher.digest()
	}

	return msgs
}