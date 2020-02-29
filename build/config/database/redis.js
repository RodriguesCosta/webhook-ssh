"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../environment");
const ioredis_1 = __importDefault(require("ioredis"));
class DbRedis {
    constructor() {
        this.redisClientOptions = {
            host: environment_1.envRedis.host,
            port: environment_1.envRedis.port,
            password: environment_1.envRedis.pass,
        };
        this.redisOptions = {
            host: this.redisClientOptions.host,
            port: this.redisClientOptions.port,
            password: this.redisClientOptions.password,
            maxRetriesPerRequest: null,
        };
        if (environment_1.envRedis.tlsCa) {
            this.redisClientOptions.tls = {
                ca: environment_1.envRedis.tlsCa,
            };
            this.redisOptions.tls = {
                ca: this.redisClientOptions.tls.ca,
            };
        }
        this.redisClient = new ioredis_1.default(this.redisOptions);
        this.redisClient.on('connect', () => {
            console.log('Redis client connected...');
        });
    }
    getClient() {
        return this.redisClient;
    }
    getRedisOptions() {
        return this.redisOptions;
    }
    getClientRedisOptions() {
        return this.redisClientOptions;
    }
}
;
const dbRedis = new DbRedis();
exports.default = dbRedis;
//# sourceMappingURL=redis.js.map