import { randomBytes } from "crypto";
import { REDACTION_CHAR_CODE } from '@questbookapp/reclaim-crypto-sdk/build/utils/redactions'
import { PrivateInput } from '../types'
import { generateProof, loadZKParamsLocally, verifyProof } from '../index'
import { encryptData } from "../utils";

const ZKPARAMS = loadZKParamsLocally()

const ENC_LENGTH = 128

jest.setTimeout(20_000)

describe('Library Tests', () => {

	it('should verify encrypted data', async() => {
		const plaintext = Buffer.alloc(ENC_LENGTH, 1)

		const privInputs: PrivateInput = {
			key: Buffer.alloc(32, 2),
			iv: Buffer.alloc(12, 3),
			startCounter: 1,
		}

		const ciphertext = encryptData(plaintext, privInputs.key, privInputs.iv)

		const pubInputs = {
			ciphertext,
			redactedPlaintext: plaintext,
		}

		const proof = await generateProof(privInputs, pubInputs, ZKPARAMS)
		// client will send proof to witness
		// witness would verify proof
		await verifyProof(proof, pubInputs, ZKPARAMS.zkey)
	})

	it('should verify redacted data', async() => {
		const plaintext = Buffer.alloc(ENC_LENGTH, 1)

		const privInputs: PrivateInput = {
			key: Buffer.alloc(32, 2),
			iv: Buffer.alloc(12, 3),
			startCounter: 1,
		}

		const ciphertext = encryptData(plaintext, privInputs.key, privInputs.iv)

		// redact last 10 bytes
		const pubInputs = {
			ciphertext: Buffer.concat([
				ciphertext.subarray(0, ENC_LENGTH - 10),
				Buffer.alloc(10, REDACTION_CHAR_CODE)
			]),
			redactedPlaintext: Buffer.concat([
				plaintext.subarray(0, ENC_LENGTH - 10),
				Buffer.alloc(10, REDACTION_CHAR_CODE)
			]),
		}

		const proof = await generateProof(privInputs, pubInputs, ZKPARAMS)
		// client will send proof to witness
		// witness would verify proof
		await verifyProof(proof, pubInputs, ZKPARAMS.zkey)
	})

	it('should fail to verify incorrect data', async() => {
		const plaintext = Buffer.alloc(ENC_LENGTH, 1)

		const privInputs: PrivateInput = {
			key: Buffer.alloc(32, 2),
			iv: Buffer.alloc(12, 3),
			startCounter: 1,
		}

		const ciphertext = encryptData(plaintext, privInputs.key, privInputs.iv)

		// redact last 10 bytes
		const pubInputs = {
			ciphertext,
			redactedPlaintext: randomBytes(ENC_LENGTH),
		}

		const proof = await generateProof(privInputs, pubInputs, ZKPARAMS)
		await expect(
			verifyProof(proof, pubInputs, ZKPARAMS.zkey)
		).rejects.toHaveProperty('message', 'redacted ciphertext (0) not congruent')
	})
})