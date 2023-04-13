import { createSignDataForClaim } from '@questbookapp/reclaim-crypto-sdk'
import { PRIVATE_KEY } from '../config'
import { ProviderClaimData, TranscriptMessage, TranscriptMessageSenderType } from '../proto/api'
import { SelectedServiceSignature } from '../signatures'
import type { X509Certificate } from '../types'
import { loadX509FromPem } from './x509'

// exporting here for better compatibility when importing into a browser env
export { ServerError, Status } from 'nice-grpc-common'

/**
 * Converts a buffer to a hex string with whitespace between each byte
 * @returns eg. '01 02 03 04'
 */
export function toHexStringWithWhitespace(buff: Buffer) {
	let hex = buff.toString('hex')
	let i = 2
	while(i < hex.length) {
		hex = hex.slice(0, i) + ' ' + hex.slice(i)
		i += 3
	}

	return hex
}

/**
 * converts a space separated hex string to a buffer
 * @param txt eg. '01 02 03 04'
 */
export function bufferFromHexStringWithWhitespace(txt: string) {
	return Buffer.from(txt.replace(/\s/g, ''), 'hex')
}

export function xor(a: Uint8Array, b: Uint8Array) {
	const result = Buffer.alloc(a.length)
	for(let i = 0; i < a.length; i++) {
		result[i] = a[i] ^ b[i]
	}

	return result
}

export function getTranscriptString(transcript: TranscriptMessage[]) {
	const strList: string[] = []
	for(const msg of transcript) {
		const sender = msg.senderType === TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_CLIENT
			? 'client'
			: 'server'
		const content = msg.redacted ? '****' : Buffer.from(msg.message).toString()
		if(strList[strList.length - 1]?.startsWith(sender)) {
			strList[strList.length - 1] += content
		} else {
			strList.push(`${sender}: ${content}`)
		}
	}

	return strList.join('\n')
}

export const unixTimestampSeconds = () => Math.floor(Date.now() / 1000)

export async function signProviderClaimData(
	data: ProviderClaimData,
) {
	const dataStr = createSignDataForClaim(data)
	return SelectedServiceSignature.sign(
		Buffer.from(dataStr, 'utf-8'),
		PRIVATE_KEY
	)
}

/**
 * Loads all .pem certificates in the given folder
 * @param path folder to load certificates from
 */
export async function loadRootCAsInFolder(path: string) {
	const { readFileSync, readdirSync } = await import('fs')
	const contents = await readdirSync(path)
	const cas: X509Certificate[] = []
	for(const file of contents) {
		const fullPath = `${path}/${file}`
		if(file.endsWith('.pem')) {
			const pemData = await readFileSync(fullPath)
			const cert = loadX509FromPem(pemData)
			cas.push(cert)
		}
	}

	return cas
}