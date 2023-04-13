/// <reference types="node" />
/// <reference types="node" />
import type { IncomingHttpHeaders } from 'http';
import { TLSReceipt } from '../proto/api';
type HttpRequest = {
    method: string;
    url: string;
    protocol: string;
    headers: IncomingHttpHeaders;
};
type HttpResponse = {
    statusCode: number;
    statusMessage: string;
    headers: IncomingHttpHeaders;
    body: Buffer;
    headersComplete: boolean;
    complete: boolean;
};
/**
 * parses http/1.1 responses
 */
export declare function makeHttpResponseParser(): {
    res: HttpResponse;
    /**
     * Parse the next chunk of data
     * @param data the data to parse
     */
    onChunk(data: Uint8Array): void;
    /**
     * Call to prevent further parsing; indicating the end of the request
     * Checks that the response is valid & complete, otherwise throws an error
     */
    streamEnded(): void;
};
/**
 * Extract the HTTP response from a TLS receipt transcript.
 * Will throw an error if the response is incomplete or redacted.
 * @returns the http response
 */
export declare function getCompleteHttpResponseFromTranscript(transcript: TLSReceipt['transcript']): HttpResponse;
/**
 * Read the HTTP request from a TLS receipt transcript.
 * Note: this currently does not read a body, only headers.
 *
 * @param transcript the transcript to read from
 * @returns the parsed HTTP request
 */
export declare function getHttpRequestHeadersFromTranscript(transcript: TLSReceipt['transcript']): HttpRequest;
export {};
