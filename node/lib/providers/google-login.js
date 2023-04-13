"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Use the Google People API to get the email address of the user
 * to prove they are owners of the same email address.
 *
 * https://developers.google.com/people/api/rest/v1/people/get
 */
const types_1 = require("../types");
const http_parser_1 = require("../utils/http-parser");
// where to send the HTTP request
const HOST = 'www.googleapis.com';
const HOSTPORT = `${HOST}:${types_1.DEFAULT_PORT}`;
// what API to call
const METHOD = 'GET';
const URL = '/oauth2/v3/userinfo?access_token=';
const googleLogin = {
    hostPort: HOSTPORT,
    areValidParams(params) {
        return typeof params.emailAddress === 'string';
    },
    createRequest({ token }) {
        // serialise the HTTP request
        const uriEncodedToken = encodeURIComponent(token);
        const url = URL + uriEncodedToken;
        const strRequest = [
            `${METHOD} ${url} HTTP/1.1`,
            'Host: ' + HOST,
            'Connection: close',
            'Content-Length: 0',
            '\r\n'
        ].join('\r\n');
        // find the token and redact it
        const data = Buffer.from(strRequest);
        const tokenStartIndex = data.indexOf(uriEncodedToken);
        return {
            data,
            // anything that should be redacted from the transcript
            // should be added to this array
            redactions: [
                {
                    fromIndex: tokenStartIndex,
                    toIndex: tokenStartIndex + uriEncodedToken.length
                }
            ]
        };
    },
    assertValidProviderReceipt(receipt, { emailAddress }) {
        var _a;
        // ensure the request was sent to the right place
        if (receipt.hostPort !== HOSTPORT) {
            throw new Error(`Invalid hostPort: ${receipt.hostPort}`);
        }
        // parse the HTTP request & check
        // the method, URL, headers, etc. match what we expect
        const req = (0, http_parser_1.getHttpRequestHeadersFromTranscript)(receipt.transcript);
        if (req.method !== METHOD.toLowerCase()) {
            throw new Error(`Invalid method: ${req.method}`);
        }
        if (!req.url.startsWith(URL)) {
            throw new Error(`Invalid URL: ${req.url}`);
        }
        // we ensure the connection header was sent as "close"
        // this is done to avoid any possible malicious request
        // that contains multiple requests, but via redactions
        // is spoofed as a single request
        if (req.headers['connection'] !== 'close') {
            throw new Error('Invalid connection header');
        }
        // now we parse the HTTP response & check
        // if the emailAddress returned by the API
        // matches the parameters the user provided
        const res = (0, http_parser_1.getCompleteHttpResponseFromTranscript)(receipt.transcript);
        if (res.statusCode !== 200) {
            throw new Error(`Invalid status code: ${res.statusCode}`);
        }
        if (!((_a = res.headers['content-type']) === null || _a === void 0 ? void 0 : _a.startsWith('application/json'))) {
            throw new Error(`Invalid content-type: ${res.headers['content-type']}`);
        }
        // parse the body & try to find the email add
        // that the user provided in the parameters
        const json = JSON.parse(res.body.toString());
        if (json.email !== emailAddress) {
            throw new Error(`Email "${json.email}" does not match expected "${emailAddress}"`);
        }
    },
};
exports.default = googleLogin;
