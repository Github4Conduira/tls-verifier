"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const api_1 = require("../../proto/api");
const types_1 = require("../../types");
const http_parser_1 = require("../../utils/http-parser");
const utils_1 = require("./utils");
const OK_HTTP_HEADER = 'HTTP/1.1 200 OK';
const index = {
    hostPort(params) {
        const { hostname, port } = (0, url_1.parse)(params.url);
        if (!hostname) {
            throw new Error('url is incorrect');
        }
        return `${hostname}:${port !== null && port !== void 0 ? port : types_1.DEFAULT_PORT}`;
    },
    areValidParams(params) {
        return typeof params.url === 'string' &&
            (params.method === 'GET' || params.method === 'POST') &&
            (Array.isArray(params.responseSelections) && params.responseSelections.length > 0);
    },
    createRequest(secretParams, params) {
        if (!secretParams.cookieStr && !secretParams.authorisationHeader) {
            throw new Error('auth parameters are not set');
        }
        const authStr = [];
        if (secretParams.cookieStr) {
            authStr.push(`Cookie: ${secretParams.cookieStr}`);
        }
        if (secretParams.authorisationHeader) {
            authStr.push(`Authorization: ${secretParams.authorisationHeader}`);
        }
        let authLen = authStr.reduce((sum, current) => sum + current.length, 0);
        if (authStr.length > 1) {
            authLen += 2; //add \r\n
        }
        const hostPort = this.hostPort instanceof Function ? this.hostPort(params) : this.hostPort;
        const { path } = (0, url_1.parse)(params.url);
        const strRequest = [
            `${params.method} ${path} HTTP/1.1`,
            `Host: ${hostPort}`,
            ...authStr,
            'Content-Length: 0',
            'Connection: close',
            'User-Agent: reclaim/1.0.0',
            //no compression
            'accept-encoding: identity',
            '\r\n'
        ].join('\r\n');
        const data = Buffer.from(strRequest);
        const tokenStartIndex = data.indexOf(authStr[0]);
        return {
            data,
            redactions: [
                {
                    fromIndex: tokenStartIndex,
                    toIndex: tokenStartIndex + authLen
                }
            ]
        };
    },
    assertValidProviderReceipt(receipt, params) {
        const req = (0, http_parser_1.getHttpRequestHeadersFromTranscript)(receipt.transcript);
        if (req.method !== params.method.toLowerCase()) {
            throw new Error(`Invalid method: ${req.method}`);
        }
        const { hostname, path, port } = (0, url_1.parse)(params.url);
        if (!hostname || !path) {
            throw new Error('url is incorrect');
        }
        if (req.url !== path) {
            throw new Error(`Invalid URL: ${req.url}`);
        }
        if (receipt.hostPort !== `${hostname}:${port !== null && port !== void 0 ? port : types_1.DEFAULT_PORT}`) {
            throw new Error(`Invalid hostPort: ${receipt.hostPort}`);
        }
        const res = Buffer.concat(receipt.transcript
            .filter(r => (r.senderType === api_1.TranscriptMessageSenderType.TRANSCRIPT_MESSAGE_SENDER_TYPE_SERVER
            && !r.redacted))
            .map(r => r.message)).toString();
        if (!res.includes(OK_HTTP_HEADER)) {
            throw new Error('Invalid response');
        }
        for (const rs of params.responseSelections) {
            if (!new RegExp(rs.responseMatch, 'sgi').test(res)) {
                throw new Error(`Invalid receipt. Regex ${rs.responseMatch} failed to match`);
            }
        }
    },
    getResponseRedactions(response, params) {
        var _a;
        if (!((_a = params.responseSelections) === null || _a === void 0 ? void 0 : _a.length)) {
            return [];
        }
        const resStr = response.toString('binary');
        const headerEndIndex = resStr.indexOf('OK') + 2;
        const bodyStartIdx = resStr.indexOf('\r\n\r\n');
        if (bodyStartIdx < 0) {
            throw new Error('Failed to find body');
        }
        const body = resStr.slice(bodyStartIdx);
        const reveals = [{ fromIndex: 0, toIndex: headerEndIndex }];
        for (const rs of params.responseSelections) {
            let element = body;
            let elementIdx = -1;
            let elementLength = -1;
            if (rs.xPath) {
                element = (0, utils_1.extractHTMLElement)(body, rs.xPath, !!rs.jsonPath);
                elementIdx = resStr.indexOf(element);
                if (elementIdx < headerEndIndex) {
                    throw new Error('Failed to find element');
                }
                elementLength = element.length;
            }
            if (rs.jsonPath) {
                const { start, end } = (0, utils_1.extractJSONValueIndex)(element, rs.jsonPath);
                if (start < headerEndIndex) {
                    throw new Error('Failed to find element');
                }
                element = resStr.slice(elementIdx + start, elementIdx + end);
                elementIdx += start;
                elementLength = end - start;
            }
            const regexp = new RegExp(rs.responseMatch, 'gim');
            if (!regexp.test(element)) {
                throw new Error('regexp does not match found element');
            }
            reveals.push({ fromIndex: elementIdx, toIndex: elementIdx + elementLength });
        }
        reveals.sort((a, b) => {
            return a.toIndex - b.toIndex;
        });
        const redactions = [];
        let currentIndex = 0;
        for (const r of reveals) {
            if (currentIndex < r.fromIndex) {
                redactions.push({ fromIndex: currentIndex, toIndex: r.fromIndex });
            }
            currentIndex = r.toIndex;
        }
        redactions.push({ fromIndex: currentIndex, toIndex: response.length });
        return redactions;
    },
};
exports.default = index;
