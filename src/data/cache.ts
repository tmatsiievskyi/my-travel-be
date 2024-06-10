import { config } from '@config';
import { TCacheObjKeys, TCacheStringKeys } from '@itypes/util.types';
import { logger } from '@utils/logger.util';
import Redis from 'ioredis';

const client = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  lazyConnect: true,
});

const connect = async () => {
  try {
    await client.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.error(`Could not connect to Redis: ${err}`);
    process.exit(1);
  }
};

class CacheClient {
  public static STRING_KEYS = {
    AUTH_SESSION: (userId: string) => `auth:session:${userId}`,
  } as const;
  public static OBJ_KEYS = {
    DATA_USER: (userId: string) => `data:user:${userId}`,
  };

  public static setString(
    key: TCacheStringKeys,
    value: string,
    expires: number,
    keyData?: string,
  ) {
    try {
      const val = this.STRING_KEYS[key];
      return typeof val === 'string'
        ? client.set(val, value, 'EX', expires)
        : client.set(val(keyData || ''), value, 'EX', expires);
    } catch (error) {
      logger.warn(error); //TODO: throw error
    }
  }

  public static getString(key: TCacheStringKeys, keyData?: string) {
    try {
      const val = this.STRING_KEYS[key];
      return typeof val === 'string'
        ? client.get(val)
        : client.get(val(keyData || ''));
    } catch (error) {
      logger.warn(error); //TODO: throw error
    }
  }

  public static setObj(
    key: TCacheObjKeys,
    value: Object,
    expires: number,
    keyData?: string,
  ) {
    try {
      const val = this.OBJ_KEYS[key];
      return typeof val === 'string'
        ? client.set(val, JSON.stringify(value), 'EX', expires)
        : client.set(val(keyData || ''), JSON.stringify(value), 'EX', expires);
    } catch (error) {
      logger.warn(error);
    }
  }

  public static async getObj<T>(key: TCacheObjKeys, keyData?: string) {
    try {
      const val = this.OBJ_KEYS[key];
      return typeof val === 'string'
        ? (JSON.parse((await client.get(val)) || '') as T)
        : (JSON.parse((await client.get(val(keyData || ''))) || '') as T);
    } catch (error) {
      throw new Error();
      logger.warn(error); //TODO: throw error
    }
  }

  // public static setHash(key: TCacheHashKeys, value: Object, keyData?: string) {
  //   try {
  //     const keyVal = this.HASH_KEYS[key];
  //     return typeof keyVal === 'string'
  //       ? client.hmset(keyVal, value)
  //       : client.hmset(keyVal(keyData || ''), value);
  //   } catch (error) {
  //     logger.warn(error);
  //   }
  // }

  // public static setSession(userId: string, token: string, expires: number) {
  //   try {
  //     const resp = client.set(`session:${userId}`, token, 'EX', expires);
  //   } catch (error) {
  //     logger.warn(error); // TODO: throw error
  //   }
  // }

  // public static getSession(userId: string) {
  //   try {
  //     return client.get(`session:${userId}`);
  //   } catch (error) {
  //     logger.warn(error); // TODO: throw error
  //   }
  // }

  public static deleteSession(userId: string) {
    try {
      return client.del(`session:${userId}`);
    } catch (error) {
      logger.warn(error); // TODO: throw error
    }
  }
}

export { client, connect, CacheClient };
