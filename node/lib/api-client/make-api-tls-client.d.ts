/// <reference types="node" />
import { ZKParams } from '@questbook/reclaim-zk';
import { Logger } from 'pino';
import { InitialiseSessionRequest, ReclaimWitnessClient } from '../proto/api';
import { TLSConnectionOptions } from '../types';
import { BufferSlice } from '../types/sessions';
export type APITLSClientOptions = {
    host: string;
    port: number;
    client: ReclaimWitnessClient;
    /** return the sections of the response to redact */
    redactResponse?(data: Buffer): BufferSlice[];
    request?: InitialiseSessionRequest;
    logger?: Logger;
    additionalConnectOpts?: TLSConnectionOptions;
    zkParams?: ZKParams;
};
export declare const makeAPITLSClient: ({ host, port, client, redactResponse, request, logger: _logger, additionalConnectOpts, zkParams }: APITLSClientOptions) => {
    generatePSK: () => Promise<void>;
    /**
     * handle data received from the server
     * @param clb handle data, return if the block should be revealed or not
     */
    handleDataFromServer(clb: (data: Buffer) => void): Promise<() => void>;
    connect(): Promise<() => void>;
    cancel(): Promise<void>;
    finish(): Promise<import("../proto/api").FinaliseSessionResponse>;
    write(data: Buffer, redactedSections: BufferSlice[]): Promise<void>;
};
