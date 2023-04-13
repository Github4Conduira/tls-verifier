/// <reference types="node" />
import { ProcessPacket, TLSClientOptions, TLSEventEmitter, TLSHandshakeOptions, TLSSessionTicket } from '../types';
export declare function makeTLSClient({ host, verifyServerCertificate, rootCAs, logger: _logger, cipherSuites, crypto, write }: TLSClientOptions): {
    ev: TLSEventEmitter;
    hasEnded(): boolean;
    getKeyPair(): {
        pubKey: Buffer;
        privKey: Buffer;
    };
    getKeys(): {
        recordSendCount: number;
        recordRecvCount: number;
        masterSecret: Buffer;
        clientSecret: Buffer;
        serverSecret: Buffer;
        clientEncKey: Buffer;
        serverEncKey: Buffer;
        clientIv: Buffer;
        serverIv: Buffer;
    } | undefined;
    getSessionId(): Buffer;
    isHandshakeDone(): boolean;
    getPskFromTicket(ticket: TLSSessionTicket): {
        identity: Buffer;
        ticketAge: number;
        finishKey: Buffer;
        resumeMasterSecret: Buffer;
        earlySecret: Buffer;
        cipherSuite: "TLS_CHACHA20_POLY1305_SHA256" | "TLS_AES_256_GCM_SHA384" | "TLS_AES_128_GCM_SHA256";
    };
    startHandshake(opts?: TLSHandshakeOptions): Promise<void>;
    handleRawData(data: Buffer): void;
    updateTrafficKeys(requestUpdateFromServer?: boolean): Promise<void>;
    processPacket: ProcessPacket;
    write(data: Buffer): Promise<void>;
    end: () => Promise<void>;
};
