"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envIsDev = () => process.env.NODE_ENV == 'development' ? true : false;
exports.envIsTest = () => process.env.NODE_ENV == 'test' ? true : false;
exports.envNotRate = () => process.env.NOT_RATE == 'true' ? true : false;
exports.envAppName = process.env.APP_NAME;
exports.envServer = {
    portHttp: process.env.PORT_HTTP || 80,
    portHttps: process.env.PORT_HTTPS || 443,
    privkey: Buffer.from(process.env.HTTPS_PRIVKEY_PEM, 'base64').toString(),
    fullchain: Buffer.from(process.env.HTTPS_FULLCHAIN_PEM, 'base64').toString(),
    domain: process.env.SERVER_DOMAIN,
    domainUrl: `${exports.envIsDev() || exports.envIsTest() ? 'http' : 'https'}://${process.env.SERVER_DOMAIN}`,
};
exports.envRedis = {
    host: process.env.REDISDB_HOST,
    port: Number(process.env.REDISDB_PORT),
    pass: process.env.REDISDB_PASS,
    tlsCa: process.env.REDISDB_CERTIFICATE_BASE64 ? Buffer.from(process.env.REDISDB_CERTIFICATE_BASE64, 'base64').toString() : undefined,
};
exports.envSentry = {
    dsn: process.env.SENTRY_DSN,
};
exports.envAdminMaster = process.env.ADMIN_MASTER;
//# sourceMappingURL=environment.js.map