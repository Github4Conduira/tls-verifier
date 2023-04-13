"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amazon_order_history_1 = __importDefault(require("./amazon-order-history"));
const github_1 = __importDefault(require("./github"));
const google_login_1 = __importDefault(require("./google-login"));
const http_provider_1 = __importDefault(require("./http-provider"));
const mock_login_1 = __importDefault(require("./mock-login"));
const ycombinator_login_1 = __importDefault(require("./ycombinator-login"));
const providers = {
    'google-login': google_login_1.default,
    'mock-login': mock_login_1.default,
    'amazon-order-history': amazon_order_history_1.default,
    'yc-login': ycombinator_login_1.default,
    'github-contributor': github_1.default,
    'http': http_provider_1.default
};
exports.default = providers;
