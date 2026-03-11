"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicApiBaseUrl = exports.getAllowedCorsOrigins = void 0;
const server_1 = require("./server");
const DEFAULT_SERVER_IP = '192.168.1.19';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const WILDCARD_HOSTS = new Set(['0.0.0.0', '::']);
const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '');
const getAllowedCorsOrigins = () => {
    const configuredOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean);
    if (configuredOrigins.length > 0) {
        return configuredOrigins;
    }
    const frontPort = process.env.FRONTEND_PORT || '5174';
    const serverIp = process.env.SERVER_IP || DEFAULT_SERVER_IP;
    return [
        `http://localhost:${frontPort}`,
        `http://127.0.0.1:${frontPort}`,
        `http://${serverIp}:${frontPort}`,
    ];
};
exports.getAllowedCorsOrigins = getAllowedCorsOrigins;
const getPublicApiBaseUrl = () => {
    const explicitUrl = (process.env.PUBLIC_API_BASE_URL || '').trim();
    if (explicitUrl) {
        return normalizeOrigin(explicitUrl);
    }
    const explicitHost = (process.env.PUBLIC_API_HOST || '').trim();
    if (explicitHost) {
        return `http://${explicitHost}:${(0, server_1.getPort)()}`;
    }
    const host = (0, server_1.getHost)();
    if (!LOCAL_HOSTS.has(host) && !WILDCARD_HOSTS.has(host)) {
        return `http://${host}:${(0, server_1.getPort)()}`;
    }
    const serverIp = process.env.SERVER_IP || DEFAULT_SERVER_IP;
    if (process.env.NODE_ENV === 'production') {
        return `http://${serverIp}:${(0, server_1.getPort)()}`;
    }
    return `http://localhost:${(0, server_1.getPort)()}`;
};
exports.getPublicApiBaseUrl = getPublicApiBaseUrl;
