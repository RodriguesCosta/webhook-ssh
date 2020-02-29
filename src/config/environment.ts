export const envIsDev = () => process.env.NODE_ENV == 'development' ? true : false;
export const envIsTest = () => process.env.NODE_ENV == 'test' ? true : false;

export const envAppName = process.env.APP_NAME;

export const envServer = {
  portHttp: process.env.PORT_HTTP || 80,
  portHttps: process.env.PORT_HTTPS || 443,
  privkey: Buffer.from(process.env.HTTPS_PRIVKEY_PEM, 'base64').toString(),
  fullchain: Buffer.from(process.env.HTTPS_FULLCHAIN_PEM, 'base64').toString(),
  domain: process.env.SERVER_DOMAIN,
  domainUrl: `${envIsDev() || envIsTest() ? 'http' : 'https'}://${process.env.SERVER_DOMAIN}`,
};

export const envRedis = {
  host: process.env.REDISDB_HOST,
  port: Number(process.env.REDISDB_PORT),
  pass: process.env.REDISDB_PASS,
  tlsCa: process.env.REDISDB_CERTIFICATE_BASE64 ? Buffer.from(process.env.REDISDB_CERTIFICATE_BASE64, 'base64').toString() : undefined,
};

export const envSentry = {
  dsn: process.env.SENTRY_DSN,
};

export const envAuth = {
  defaultUser: process.env.DEFAULT_USER,
  defaultPass: process.env.DEFAULT_PASS,
};
