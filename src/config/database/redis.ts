import { envRedis } from '../environment';

import ioredis from 'ioredis';
import { ClientOpts } from 'redis';

class DbRedis {

  private redisClient: ioredis.Redis
  private redisOptions: ioredis.RedisOptions
  private redisClientOptions: ClientOpts

  public constructor() {
    this.redisClientOptions = {
      host: envRedis.host,
      port: envRedis.port,
      password: envRedis.pass,
    };

    this.redisOptions = {
      host: this.redisClientOptions.host,
      port: this.redisClientOptions.port,
      password: this.redisClientOptions.password,
      maxRetriesPerRequest: null,
    };

    if (envRedis.tlsCa) {
      this.redisClientOptions.tls = {
        ca: envRedis.tlsCa,
      };
      this.redisOptions.tls = {
        ca: this.redisClientOptions.tls.ca,
      };
    }

    this.redisClient = new ioredis(this.redisOptions);

    this.redisClient.on('connect', () => {
      console.log('Redis client connected...');
    });
  }

  public getClient() {
    return this.redisClient;
  }

  public getRedisOptions() {
    return this.redisOptions;
  }

  public getClientRedisOptions() {
    return this.redisClientOptions;
  }

};

const dbRedis = new DbRedis();
export default dbRedis;
