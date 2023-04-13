/// <reference types="node" />
import forge from 'node-forge';
import { X509Certificate } from '../types';
export declare function loadX509FromPem(pem: string | Buffer): X509Certificate<forge.pki.Certificate>;
export declare function loadX509FromDer(der: Buffer): X509Certificate<forge.pki.Certificate>;
