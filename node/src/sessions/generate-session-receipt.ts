import { loadZKParamsLocally } from '@questbook/reclaim-zk'
import { Logger } from 'pino'
import { PRIVATE_KEY } from '../config'
import { TlsCipherSuiteType, TLSReceipt, TranscriptMessage, TranscriptMessageSenderType } from '../proto/api'
import { SelectedServiceSignature } from '../signatures'
import { SUPPORTED_CIPHER_SUITE_MAP } from '../tls/constants'
import { decryptWrappedRecord } from '../tls/wrapped-record'
import { TLSSession } from '../types/sessions'
import { unixTimestampSeconds } from '../utils'
import { verifyZKBlock } from '../utils/zk'

const params = loadZKParamsLocally()

export async function generateSessionReceipt(
	session: TLSSession,
	cipherSuiteType: TlsCipherSuiteType,
	logger?: Logger
) {
	const cipherSuite = getCipherSuite()
	const mappedTranscript = await Promise.all(
		session.transcript.map(async({
			sender,
			packet,
			zkReveal,
			directReveal,
		}): Promise<TranscriptMessage> => {
			let redacted = !!packet!.authenticationTag
			let plaintext = new Uint8Array()
			if(!packet?.authenticationTag?.length) {
				redacted = false
				plaintext = packet!.content
			} else if(directReveal?.key?.length) {
				const { key, iv } = directReveal
				const result = decryptWrappedRecord(packet.content!, {
					authTag: packet.authenticationTag,
					iv,
					key,
					recordHeader: packet.recordHeader,
					recordNumber: undefined,
					cipherSuite,
				})

				redacted = false
				plaintext = result.plaintext
			} else if(zkReveal?.proofs?.length) {
				const result = await verifyZKBlock(
					{
						ciphertext: packet.content,
						zkReveal,
						params,
						logger,
					}
				)
				plaintext = result.redactedPlaintext
				redacted = false
			}

			return {
				senderType: sender === 'client'
					? TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT
					: TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER,
				redacted,
				message: plaintext,
			}
		})
	)

	const receipt: TLSReceipt = {
		hostPort: `${session.host}:${session.port}`,
		transcript: mappedTranscript,
		timestampS: unixTimestampSeconds(),
		signature: new Uint8Array(),
	}

	const receiptBytes = TLSReceipt.encode(receipt).finish()
	receipt.signature = await SelectedServiceSignature.sign(receiptBytes, PRIVATE_KEY)

	return receipt


	function getCipherSuite(): keyof typeof SUPPORTED_CIPHER_SUITE_MAP {
		if(cipherSuiteType) {
			switch (cipherSuiteType) {
			case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_CHACHA20_POLY1305_SHA256:
				return 'TLS_CHACHA20_POLY1305_SHA256'
			case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_128_GCM_SHA256:
				return 'TLS_AES_128_GCM_SHA256'
			case TlsCipherSuiteType.TLS_CIPHER_SUITE_TYPE_AES_256_GCM_SHA384:
				return 'TLS_AES_256_GCM_SHA384'
			default:
				throw new Error(`Unsupported cipher suite type: ${cipherSuite}`)
			}
		}

		const key = session.transcript
			.find(t => t.directReveal?.key)
			?.directReveal?.key
		return key?.length === 16
			? 'TLS_AES_128_GCM_SHA256'
			: 'TLS_AES_256_GCM_SHA384'
	}
}