"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHost = exports.getPort = void 0;
const getPort = () => {
    return process.env.HTTP_PLATFORM_PORT || process.env.PORT || '3001';
};
exports.getPort = getPort;
const getHost = () => {
    return process.env.SERVER_HOST || process.env.HOST || '0.0.0.0';
};
exports.getHost = getHost;
