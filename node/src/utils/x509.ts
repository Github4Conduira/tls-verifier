import forge from 'node-forge'
import { X509Certificate } from '../types'

export function loadX509FromPem(pem: string | Buffer): X509Certificate<forge.pki.Certificate> {
	const cert = forge.pki.certificateFromPem(pem.toString('utf-8'))
	return {
		internal: cert,
		isIssuer(ofCert) {
			return ofCert.internal.isIssuer(cert)
		},
		getPublicKey() {
			return forge.pki.publicKeyToPem(cert.publicKey)
		},
		verifyIssued(otherCert) {
			return cert.verify(otherCert.internal)
		},
		serialiseToPem() {
			return forge.pki.certificateToPem(cert)
		},
	}
}

export function loadX509FromDer(der: Buffer) {
	const PEM_PREFIX = '-----BEGIN CERTIFICATE-----\n'
	const PEM_POSTFIX = '-----END CERTIFICATE-----'

	const splitText = der.toString('base64').match(/.{0,64}/g)!.join('\n')
	const pem = `${PEM_PREFIX}${splitText}${PEM_POSTFIX}`
	return loadX509FromPem(pem)
}