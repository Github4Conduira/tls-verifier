"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJSONValueIndex = exports.extractHTMLElement = void 0;
const esprima_next_1 = require("esprima-next");
const jsdom_1 = require("jsdom");
const jsonpath_plus_1 = require("jsonpath-plus");
function extractHTMLElement(html, xPath, contentsOnly) {
    var _a;
    try {
        const dom = new jsdom_1.JSDOM(html, { includeNodeLocations: true }), doc = (_a = dom === null || dom === void 0 ? void 0 : dom.window) === null || _a === void 0 ? void 0 : _a.document;
        if (contentsOnly) {
            return doc.evaluate(xPath, doc, null, 2 /*XPathResult.STRING_TYPE*/).stringValue;
        }
        else {
            const node = doc.evaluate(xPath, doc, null, 9 /*XPathResult.FIRST_ORDERED_NODE_TYPE */);
            if (node.singleNodeValue) {
                const location = dom.nodeLocation(node.singleNodeValue);
                if (location) {
                    return html.slice(location.startOffset, location.endOffset);
                }
            }
        }
    }
    catch (e) {
        throw new Error(`error while evaluating xPath: ${e}`);
    }
    return '';
}
exports.extractHTMLElement = extractHTMLElement;
function extractJSONValueIndex(json, jsonPath) {
    const pointers = (0, jsonpath_plus_1.JSONPath)({ path: jsonPath, json: JSON.parse(json), wrap: false, resultType: 'pointer' });
    if (!pointers) {
        throw new Error('jsonPath not found');
    }
    const tree = (0, esprima_next_1.parseScript)('(' + json + ')', { range: true }); //wrap in parentheses for esprima to parse
    if (tree.body[0] instanceof esprima_next_1.ExpressionStatement) {
        if (tree.body[0].expression instanceof esprima_next_1.ObjectExpression) {
            const index = traverse(tree.body[0].expression, '', pointers[0]);
            if (index) {
                return {
                    start: index.start - 1,
                    end: index.end - 1
                };
            }
        }
    }
    throw new Error('jsonPath not found');
}
exports.extractJSONValueIndex = extractJSONValueIndex;
/**
 * recursively go through AST tree and build a JSON path while it's not equal to the one we search for
 * @param o - esprima expression for root object
 * @param path - path that is being built
 * @param pointer - JSON pointer to compare to
 */
function traverse(o, path, pointer) {
    if (o instanceof esprima_next_1.ObjectExpression) {
        for (const p of o.properties) {
            if (p instanceof esprima_next_1.Property) {
                let localPath;
                if (p.key.type === esprima_next_1.Syntax.Literal) {
                    localPath = path + '/' + p.key.value;
                }
                else {
                    localPath = path;
                }
                if (localPath === pointer && ('range' in p) && Array.isArray(p.range)) {
                    return {
                        start: p.range[0],
                        end: p.range[1]
                    };
                }
                if (p.value instanceof esprima_next_1.ObjectExpression) {
                    const res = traverse(p.value, localPath, pointer);
                    if (res) {
                        return res;
                    }
                }
                if (p.value instanceof esprima_next_1.ArrayExpression) {
                    const res = traverse(p.value, localPath, pointer);
                    if (res) {
                        return res;
                    }
                }
            }
        }
    }
    if (o instanceof esprima_next_1.ArrayExpression) {
        for (let i = 0; i < o.elements.length; i++) {
            const element = o.elements[i];
            if (!element) {
                continue;
            }
            const localPath = path + '/' + i;
            if (localPath === pointer && ('range' in element) && Array.isArray(element.range)) {
                return {
                    start: element.range[0],
                    end: element.range[1]
                };
            }
            if (element instanceof esprima_next_1.ObjectExpression) {
                const res = traverse(element, localPath, pointer);
                if (res) {
                    return res;
                }
            }
            if (element instanceof esprima_next_1.ArrayExpression) {
                const res = traverse(element, localPath, pointer);
                if (res) {
                    return res;
                }
            }
        }
    }
    return null;
}
