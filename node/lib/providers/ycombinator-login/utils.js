"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = void 0;
/**
 * Parse the html response for the ycombinator provider
 * Note: the classes may seem arbitrary,
 * but they are the only way to select the correct nodes
 */
function parseResponse(html) {
    const hasBookfaceObject = parseHasBookfaceNode(html);
    const userInfoObject = parseUserInfoNode(html);
    return {
        hasBookfaceObject,
        userInfoObject
    };
}
exports.parseResponse = parseResponse;
function parseHasBookfaceNode(html) {
    const matches = [...html.matchAll(/"hasBookface":true/g)].map(value => value.index);
    if (matches.length !== 1) {
        throw new Error('Invalid login');
    }
    return { hasBookface: true };
}
const userRegexp = /\{"id":\d+.*?waas_admin.*?:{.*?}.*?:\{.*?}.*?(?:full_name|first_name).*?}/g;
function parseUserInfoNode(html) {
    const matches = html.match(userRegexp);
    if ((matches === null || matches === void 0 ? void 0 : matches.length) !== 1) {
        throw new Error('Invalid login');
    }
    const userObj = JSON.parse(matches[0]);
    return { currentUser: userObj };
}
