export type PrivateKey = string

/**
 * public key in PEM/DER format
 * PEM => string
 * DER => Buffer
 */
export type CertificatePublicKey = string | Buffer

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type X509Certificate<T = any> = {
	internal: T
	isIssuer(ofCert: X509Certificate<T>): boolean
	getPublicKey(): CertificatePublicKey
	/**
	 * verify this certificate issued the certificate passed
	 * @param otherCert the supposedly issued certificate to verify
	 * */
	verifyIssued(otherCert: X509Certificate<T>): boolean

	serialiseToPem(): string
}