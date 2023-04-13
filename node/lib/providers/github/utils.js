"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGithubError = void 0;
const isGithubError = (error) => {
    return typeof error === 'object' && error !== null && (error.hasOwnProperty('message') && (error.hasOwnProperty('documentation_url') || error.hasOwnProperty('errors')));
};
exports.isGithubError = isGithubError;
