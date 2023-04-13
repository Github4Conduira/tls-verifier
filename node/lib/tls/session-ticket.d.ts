/// <reference types="node" />
import { TLSSessionTicket } from '../types';
import { SUPPORTED_CIPHER_SUITE_MAP } from './constants';
type GetResumableSessionTicketOptions = {
    masterKey: Buffer;
    /** hello msgs without record header */
    hellos: Buffer[] | Buffer;
    cipherSuite: keyof typeof SUPPORTED_CIPHER_SUITE_MAP;
};
export declare function parseSessionTicket(data: Buffer): TLSSessionTicket;
export declare function getPskFromTicket(ticket: TLSSessionTicket, { masterKey, hellos, cipherSuite }: GetResumableSessionTicketOptions): {
    identity: Buffer;
    ticketAge: number;
    finishKey: Buffer;
    resumeMasterSecret: Buffer;
    earlySecret: Buffer;
    cipherSuite: "TLS_CHACHA20_POLY1305_SHA256" | "TLS_AES_256_GCM_SHA384" | "TLS_AES_128_GCM_SHA256";
};
export {};
