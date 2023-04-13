"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = void 0;
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
//const DATE_REGEX = /[0-9]{1,2} [a-z]{1,15} [0-9]{4}/i
/**
 * Parse the html response for the amazon order history provider
 * Note: the classes may seem arbitrary,
 * but they are the only way to select the correct nodes
 */
function parseResponse(html) {
    const good = (0, sanitize_html_1.default)(html, {
        allowedTags: ['div', 'a'],
        allowedAttributes: {
            'a': ['class', 'href'],
            'div': ['class']
        },
        allowedClasses: {
            'img': ['yo-critical-feature']
        },
        disallowedTagsMode: 'discard'
    });
    const elem = (0, node_html_parser_1.default)(good);
    const aNodes = elem.querySelectorAll('.a-link-normal');
    if (!aNodes.length) {
        throw new Error('No orders found in response');
    }
    return aNodes.filter(value => {
        return value.attributes['href'].startsWith('/gp/product/');
    }).map(parseOrderNode);
}
exports.parseResponse = parseResponse;
function parseOrderNode(node, i) {
    const url = node.attributes['href'];
    if (!url) {
        throw new Error(`Invalid order url: ${i}`);
    }
    const name = cleanText(node.innerText);
    return {
        name,
        url
    };
}
/** remove excess whitespace */
function cleanText(txt) {
    return txt.trim().replace(/\s+/g, ' ');
}
