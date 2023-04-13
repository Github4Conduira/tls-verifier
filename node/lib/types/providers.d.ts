/// <reference types="node" />
import type { ProviderClaimData, TLSReceipt } from '../proto/api';
import type { BufferSlice } from './sessions';
import { TLSConnectionOptions } from './tls';
export declare const DEFAULT_PORT = 443;
/**
 * Generic interface for a provider that can be used to verify
 * claims on a TLS receipt
 * @notice "Params" are the parameters you want to claim against.
 * These would typically be found in the response body
 * @notice "SecretParams" are the parameters that are used to make the API request.
 * These must be redacted in the request construction in "createRequest" & cannot be viewed by anyone
 */
export interface Provider<Params extends {
    [_: string]: unknown;
}, SecretParams> {
    /**
     * host:port pairs considered valid for this provider;
     * the protocol establishes a connection to the first one
     * when a request is received from a user
     * Eg. ["www.google.com:443"]
     * */
    hostPort: string | ((params: Params) => string);
    /** extra options to pass to the client like root CA certificates */
    additionalClientOptions?: TLSConnectionOptions;
    /** check the parameters are valid */
    areValidParams(params: {
        [_: string]: unknown;
    }): params is Params;
    /** generate the raw request to be sent to through the TLS receipt */
    createRequest(secretParams: SecretParams, params: Params): {
        data: Buffer;
        redactions: BufferSlice[];
    };
    /**
     * Return the slices of the response to redact
     * Eg. if the response is "hello my secret is xyz",
     * and you want to redact "xyz", you would return
     * [{start: 17, end: 20}]
     * */
    getResponseRedactions?(response: Buffer, params: Params): BufferSlice[];
    /**
     * verify a generated TLS receipt against given parameters
     * to ensure the receipt does contain the claims the
     * user is claiming to have
     * @param receipt the TLS receipt to verify
     * @param params the parameters to verify the receipt against. Eg. `{"email": "abcd@gmail.com"}`
     * */
    assertValidProviderReceipt(receipt: TLSReceipt, params: Params): void | Promise<void>;
}
export type CreateStep = {
    name: 'creating';
    chainId: number;
    claimId: number;
    witnessHosts: string[];
} | {
    name: 'witness-done';
    chainId: number;
    claimData: ProviderClaimData;
    signaturesDone: string[];
};
