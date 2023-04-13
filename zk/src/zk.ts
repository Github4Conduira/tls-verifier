import { isRedactionCongruent, REDACTION_CHAR_CODE } from '@reclaimprotocol/crypto-sdk'
import { PrivateInput, Proof, PublicInput, UintArray, ZKOperator } from "./types"
import { makeUintArray } from "./utils"

// chunk size in 32-bit words
const CHUNK_SIZE = 16
// cha-cha block size in 32-bit words
const BLOCK_SIZE = 16

/**
 * Generate ZK proof for CHACHA20-CTR encryption.
 * Circuit proves that the ciphertext is a
 * valid encryption of the given plaintext.
 * The plaintext can be partially redacted.
 * 
 * @param privateInput private input to the circuit
 * will include the key, iv, and counter 
 * @param pub public input to the circuit,
 * will include the ciphertext and redacted plaintext
 * @param zkParams ZK params -- verification key and circuit wasm
 */
export async function generateProof(
	{
		key,
		iv,
		startCounter,
	}: PrivateInput,
	pub: PublicInput,
	operator: ZKOperator
): Promise<Proof[]> {
	const keyU32 = toUintArray(Buffer.from(key))
	const nonce = toUintArray(Buffer.from(iv))

	const proofs = await chunkingPublicInputs(
		pub,
		async(ciphertext, _, i) => {
			const { proof, publicSignals } = await operator.groth16FullProve(
				{
					key: Array.from(keyU32),
					nonce: Array.from(nonce),
					counter: startCounter + i * (CHUNK_SIZE/BLOCK_SIZE),
					in: Array.from(ciphertext),
				},
			)

			return {
				proofJson: JSON.stringify(proof),
				decryptedRedactedCiphertext: makeUintArray(
					publicSignals.slice(0, CHUNK_SIZE).map((x) => +x)
				)
			}
		}
	)

	return proofs
}

/**
 * Verify a ZK proof for CHACHA20-CTR encryption.
 * 
 * @param proofs JSON proof generated by "generateProof"
 * @param publicInput 
 * @param zkey 
 */
export async function verifyProof(
	proofs: Proof[],
	publicInput: PublicInput,
	operator: ZKOperator
): Promise<void> {
	await chunkingPublicInputs(
		publicInput,
		async(redactedCiphertext, redactedPlaintext, i) => {
			// ensure that the redacted plaintext is congruent
			// with the decrypted redacted ciphertext,
			// so we know the proof is for this piece of text only
			if(!isRedactionCongruent(
				Uint8Array.from(redactedPlaintext),
				Uint8Array.from(proofs[i].decryptedRedactedCiphertext)
			)) {
				throw new Error(`redacted ciphertext (${i}) not congruent`)
			}

			// serialise to array of numbers for the ZK circuit
			const pubInputs = getSerialisedPublicInputs(
				{
					ciphertext: redactedCiphertext,
					decryptedRedactedCiphertext: proofs[i].decryptedRedactedCiphertext
				},
			)
			const chunkVerfied = await operator.groth16Verify(
				pubInputs,
				JSON.parse(proofs[i].proofJson),
			)

			if(!chunkVerfied) {
				throw new Error(`chunk ${i} not verified`)
			}
		}
	)
}

/**
 * Serialise public inputs to array of numbers for the ZK circuit
 * the format is spread (output, ciphertext, redactedPlaintext)
 * @param inp 
 */
function getSerialisedPublicInputs(
	{ decryptedRedactedCiphertext, ciphertext }: {
		decryptedRedactedCiphertext: UintArray
		ciphertext: UintArray
	}
) {
	return [
		...Array.from(decryptedRedactedCiphertext),
		...Array.from(ciphertext),
	]
}

async function chunkingPublicInputs<T>(
	{ ciphertext, redactedPlaintext }: PublicInput,
	code: (ciphertext: UintArray, redactedPlaintext: UintArray, i: number) => Promise<T>
) {
	if(ciphertext.length !== redactedPlaintext.length) {
		throw new Error('ciphertext smaller than plaintext')
	}

	// pad to nearest 16 word chunk
	const ciphertextArray = toUintArray(ciphertext)
	const buffSize = Math.ceil(ciphertextArray.length / CHUNK_SIZE) * CHUNK_SIZE
	const ciphertextChunks = chunkArray(
		padArray(ciphertextArray, buffSize),
		CHUNK_SIZE
	)
	const redactedPlaintextChunks = chunkArray(
		padArray(toUintArray(redactedPlaintext), buffSize),
		CHUNK_SIZE
	)

	const result: T[] = []
	for(let i = 0;i < ciphertextChunks.length;i++) {
		// redact ciphertext if plaintext is redacted
		// to prepare for decryption in ZK circuit
		// the ZK circuit will take in the redacted ciphertext,
		// which shall produce the redacted plaintext
		for(let j = 0;j < ciphertextChunks[i].length;j++) {
			if(redactedPlaintextChunks[i][j] === REDACTION_CHAR_CODE) {
				ciphertextChunks[i][j] = REDACTION_CHAR_CODE
			}
		}

		const r = await code(ciphertextChunks[i], redactedPlaintextChunks[i], i)
		result.push(r)
	}

	return result
}

/**
 * Convert a UintArray (uint32array) to a Uint8Array
 */
export function toUint8Array(buf: UintArray) {
	const arr = Buffer.alloc(buf.length * 4)
	for(let i = 0;i < buf.length;i++) {
		arr.writeUInt32LE(buf[i], i * 4)
	}
	return arr
}

function toUintArray(buf: Uint8Array | Buffer) {
	buf = Buffer.isBuffer(buf) ? buf : Buffer.from(buf)
	const arr = makeUintArray(buf.length / 4)
	for(let i = 0;i < arr.length;i++) {
		arr[i] = (buf as Buffer).readUInt32LE(i * 4)
	}
	return arr
}

function padArray(buf: UintArray, size: number): UintArray {
	return makeUintArray(
		[
			...Array.from(buf),
			...new Array(size - buf.length).fill(REDACTION_CHAR_CODE)
		]
	)
}

function chunkArray(buffer: UintArray, chunkSize: number) {
    const chunks: UintArray[] = []
    for(let i = 0; i < buffer.length; i += chunkSize) {
        chunks.push(buffer.slice(i, i + chunkSize))
    }

    return chunks
}