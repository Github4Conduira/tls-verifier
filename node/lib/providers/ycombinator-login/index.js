"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = require("zlib");
const types_1 = require("../../types");
const http_parser_1 = require("../../utils/http-parser");
const utils_1 = require("./utils");
// where to send the HTTP request
const HOST = 'bookface.ycombinator.com';
const HOSTPORT = `${HOST}:${types_1.DEFAULT_PORT}`;
const PATH = '/home';
const YCombinatorLogin = {
    hostPort: HOSTPORT,
    areValidParams(params) {
        return (typeof params.userId === 'number'
            && params.userId !== 0);
    },
    createRequest({ cookieStr }) {
        // this is a simple http request construction.
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
        const strRequest = [
            `GET ${PATH} HTTP/1.1`,
            'Host: ' + HOST,
            // "connection: close" ensures the server terminates
            // the connection after the first HTTP request is done.
            // We add this header to prevent the user from creating
            // multiple http requests in the same session
            'Connection: close',
            `cookie: ${cookieStr}`,
            'User-Agent: reclaim/1.0.0',
            'Accept-Encoding: gzip, deflate',
            '\r\n'
        ].join('\r\n');
        // find the cookie string and redact it
        const data = Buffer.from(strRequest);
        const cookieStartIndex = data.indexOf(cookieStr);
        return {
            data,
            // anything that should be redacted from the transcript
            // should be added to this array
            redactions: [
                {
                    fromIndex: cookieStartIndex,
                    toIndex: cookieStartIndex + cookieStr.length
                }
            ]
        };
    },
    assertValidProviderReceipt(receipt, { userId }) {
        var _a;
        // ensure the request was sent to the right place
        if (receipt.hostPort !== HOSTPORT) {
            throw new Error(`Invalid hostPort: ${receipt.hostPort}`);
        }
        // parse the HTTP request & check
        // the method, URL, headers, etc. match what we expect
        const req = (0, http_parser_1.getHttpRequestHeadersFromTranscript)(receipt.transcript);
        if (req.method !== 'get') {
            throw new Error(`Invalid method: ${req.method}`);
        }
        if (!req.url.startsWith(PATH)) {
            throw new Error(`Invalid path: ${req.url}`);
        }
        const res = (0, http_parser_1.getCompleteHttpResponseFromTranscript)(receipt.transcript);
        if (!((_a = res.headers['content-type']) === null || _a === void 0 ? void 0 : _a.startsWith('text/html'))) {
            throw new Error(`Invalid content-type: ${res.headers['content-type']}`);
        }
        let html;
        if (res.headers['content-encoding'] === 'gzip') {
            const buf = Buffer.from(res.body);
            html = (0, zlib_1.gunzipSync)(buf).toString();
        }
        else {
            html = res.body.toString();
        }
        const { hasBookfaceObject, userInfoObject } = (0, utils_1.parseResponse)(html);
        // Check if the account is valid and has access to bookface
        if (!hasBookfaceObject['hasBookface']) {
            throw new Error('Invalid login - does not have bookface access');
        }
        // Check if the logged in user the same as they calimed to be
        if (userInfoObject['currentUser']['id'] !== userId) {
            throw new Error('Invalid login - inconsistent user id');
        }
    },
};
exports.default = YCombinatorLogin;
