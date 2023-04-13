import { generateProof, toUint8Array, toUintArray, verifyProof, ZKParams } from '@questbook/reclaim-zk'
import { isFullyRedacted, REDACTION_CHAR_CODE } from '@questbookapp/reclaim-crypto-sdk'
import { Logger } from 'pino'
import { MAX_ZK_CHUNKS } from '../config'
import { FinaliseSessionRequest_Block as BlockReveal, FinaliseSessionRequest_BlockRevealZk } from '../proto/api'
import { BufferSlice } from '../types/sessions'
import LOGGER from './logger'
import { getBlocksToReveal } from './redactions'

const CHACHA_BLOCK_SIZE = 64

type ZKChunk = {
	chunk: Buffer
	counter: number
}

type BlockWithPlaintext = Partial<BlockReveal> & {
	ciphertext: Buffer
	plaintext: Buffer
}

type ZKBlock = {
	block: BlockWithPlaintext
	redactedPlaintext: Buffer
	zkChunks: ZKChunk[]
}

type PrepareZKProofsOpts = {
	/** blocks to prepare ZK proof for */
	blocks: BlockWithPlaintext[]
	/** params for ZK proof gen */
	params: ZKParams
	/** redact selected portions of the plaintext */
	redact: (plaintext: Buffer) => BufferSlice[]
	logger?: Logger
}

type ZKVerifyOpts = {
	ciphertext: Uint8Array
	// eslint-disable-next-line camelcase
	zkReveal: FinaliseSessionRequest_BlockRevealZk
	params: ZKParams
	logger?: Logger
}

/**
 * Generate ZK proofs for the given blocks with a redaction function.
 */
export async function prepareZkProofs(
	{
		blocks,
		params,
		redact,
		logger
	}: PrepareZKProofsOpts
) {
	logger = logger || LOGGER.child({ module: 'zk' })
	const blocksToReveal = getBlocksToReveal(
		blocks,
		redact
	)

	if(blocksToReveal === 'all') {
		return 'all'
	}

	logger.info(
		{ len: blocksToReveal.length },
		'preparing proofs for blocks'
	)

	let totalChunks = 0
	const zkBlocks = blocksToReveal.map((block): ZKBlock => {
		const chunks = getBlockWithIvCounter(block.redactedPlaintext)
		totalChunks += chunks.length
		return {
			block: block.block,
			zkChunks: chunks,
			redactedPlaintext: block.redactedPlaintext
		}
	})

	if(totalChunks > MAX_ZK_CHUNKS) {
		throw new Error(
			`Too many chunks to prove: ${totalChunks} > ${MAX_ZK_CHUNKS}`
		)
	}

	logger.info(
		{ totalChunks },
		'extracted chunks'
	)

	await Promise.all(
		zkBlocks.map(async({ block, zkChunks }) => {
			block.zkReveal = {
				proofs: await Promise.all(
					zkChunks!.map(async({ chunk, counter }) => {
						const startIdx = (counter - 1) * CHACHA_BLOCK_SIZE
						const endIdx = counter * CHACHA_BLOCK_SIZE
						const ciphertextChunk = block.ciphertext.slice(
							startIdx,
							endIdx
						)

						const [proof] = await generateProof(
							{
								key: block.directReveal!.key,
								iv: block.directReveal!.iv,
								startCounter: counter,
							},
							{
								redactedPlaintext: chunk,
								ciphertext: ciphertextChunk
							},
							params,
						)

						logger?.debug(
							{ startIdx, endIdx },
							'generated proof for chunk'
						)

						return {
							proofJson: proof.proofJson,
							decryptedRedactedCiphertext: toUint8Array(
								proof.decryptedRedactedCiphertext
							),
							redactedPlaintext: chunk,
							startIdx,
						}
					})
				)
			}

			delete block.directReveal

			return block
		})
	)

	return zkBlocks
}

/**
 * Verify the given ZK proof
 */
export async function verifyZKBlock(
	{
		ciphertext,
		zkReveal,
		params,
		logger
	}: ZKVerifyOpts
) {
	if(!zkReveal) {
		throw new Error('No ZK reveal')
	}

	const { proofs } = zkReveal
	/**
	 * to verify if the user has given us the correct redacted plaintext,
	 * and isn't providing plaintext that they haven't proven they have
	 * we start with a fully redacted plaintext, and then replace the
	 * redacted parts with the plaintext that the user has provided
	 * in the proofs
	 */
	const realRedactedPlaintext = Buffer.alloc(
		ciphertext.length,
		REDACTION_CHAR_CODE
	)

	await Promise.all(
		proofs.map(async({
			proofJson,
			decryptedRedactedCiphertext,
			redactedPlaintext,
			startIdx,
		}) => {
			// get the ciphertext chunk we received from the server
			// the ZK library, will verify that the decrypted redacted
			// ciphertext matches the ciphertext received from the server
			const ciphertextChunk = ciphertext.slice(
				startIdx,
				startIdx + redactedPlaintext.length
			)
			await verifyProof(
				[
					{
						proofJson,
						decryptedRedactedCiphertext:
							toUintArray(decryptedRedactedCiphertext),
					}
				],
				{
					redactedPlaintext,
					ciphertext: ciphertextChunk,
				},
				params.zkey
			)

			logger?.debug(
				{ startIdx, endIdx: startIdx + redactedPlaintext.length },
				'verified proof'
			)

			realRedactedPlaintext.set(
				redactedPlaintext,
				startIdx,
			)
		})
	)

	return {
		redactedPlaintext: realRedactedPlaintext,
	}
}

/**
 * Split the redacted plaintext into chacha-sized chunks,
 * and set a counter for each chunk.
 *
 * It will only return blocks that are fully or partially revealed
 * @param redactedPlaintext the redacted plaintext that need be split
 */
function getBlockWithIvCounter(
	redactedPlaintext: Buffer,
	blockSize = CHACHA_BLOCK_SIZE
) {
	const chunks = chunkBuffer(redactedPlaintext, blockSize)
	const chunksWithCounter: ZKChunk[] = []
	for(let i = 0;i < chunks.length;i++) {
		if(!isFullyRedacted(chunks[i])) {
			chunksWithCounter.push({
				chunk: chunks[i],
				counter: i + 1,
			})
		}
	}

	return chunksWithCounter
}

function chunkBuffer(buffer: Buffer, chunkSize: number) {
	const chunks: Buffer[] = []
	for(let i = 0;i < buffer.length;i += chunkSize) {
		chunks.push(buffer.slice(i, i + chunkSize))
	}

	return chunks
}