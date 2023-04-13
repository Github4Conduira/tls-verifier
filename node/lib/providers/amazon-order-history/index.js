"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const zlib_1 = require("zlib");
const types_1 = require("../../types");
const http_parser_1 = require("../../utils/http-parser");
const utils_1 = require("./utils");
// where to send the HTTP request
const HOST = 'www.amazon.in';
const HOSTPORT = `${HOST}:${types_1.DEFAULT_PORT}`;
const PATH = '/gp/your-account/order-history/ref=ppx_yo_dt_b_search';
const amazonOrderHistory = {
    hostPort: HOSTPORT,
    areValidParams(params) {
        return typeof params.productName === 'string'
            && Object.keys(params).length === 1;
    },
    createRequest({ cookieStr, qstring }) {
        // serialise the HTTP request
        // add the "search" query string
        // we won't redact it because it's not sensitive
        const qr = (0, querystring_1.stringify)({ opt: 'ab', search: qstring });
        // this is a simple http request construction.
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
        const strRequest = [
            `GET ${PATH}?${qr} HTTP/1.1`,
            'Host: ' + HOST,
            // "connection: close" ensures the server terminates
            // the connection after the first HTTP request is done.
            // We add this header to prevent the user from creating
            // multiple http requests in the same session
            'Connection: close',
            'Content-Length: 0',
            'User-Agent: reclaim/1.0.0',
            `Cookie: ${cookieStr}`,
            'Accept-Encoding: gzip, deflate, br',
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
    assertValidProviderReceipt(receipt, { productName }) {
        var _a;
        productName = productName.toLowerCase();
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
        // parse the HTML response and check if
        // the product name is in the list of orders
        const orders = (0, utils_1.parseResponse)(html);
        if (!orders.find(order => (
        // check if the order's name starts with the product name
        // this seems to be a constraint that cannot be
        // falsified but at the same time, is flexible enough
        // to account for funky descriptions in the product
        // and whitespace
        order.name.toLowerCase().startsWith(productName)))) {
            throw new Error(`Failed to find "${productName}" in receipt`);
        }
    },
};
exports.default = amazonOrderHistory;
