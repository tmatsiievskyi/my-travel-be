import {
  scrypt,
  ScryptOptions,
  randomBytes,
  timingSafeEqual,
  scryptSync,
} from 'node:crypto';
import {} from 'node:util';

export class Crypting {
  private readonly SCRYPT_PARAMS: ScryptOptions = {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  };
  private readonly SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';
  private readonly SALT_LEN = 32;
  private readonly KEY_LEN = 64;

  private serializeHash(hash: Buffer, salt: Buffer) {
    const saltString = salt.toString('base64').split('=')[0];
    const hashString = hash.toString('base64').split('=')[0];

    return `${this.SCRYPT_PREFIX}${saltString}$${hashString}`;
  }

  private parseOptions(options: string) {
    const values = [];
    const items = options.split(',');
    for (const item of items) {
      const [key, val] = item.split('=');
      values.push([[key, Number(val)]]);
    }
    return Object.fromEntries(values);
  }

  private deserializeHash(hashString: string) {
    const [, name, options, salt64, hash64] = hashString.split('$');
    if (name !== 'scrypt') {
      throw new Error('Wrong scrypt module');
    }
    const params = this.parseOptions(options);
    const salt = Buffer.from(salt64, 'base64');
    const hash = Buffer.from(hash64, 'base64');
    return { params, salt, hash };
  }

  public hashPassword = (password: string) => {
    const salt = randomBytes(this.SALT_LEN);
    const passwordBuffer = scryptSync(
      password,
      salt,
      this.KEY_LEN,
      this.SCRYPT_PARAMS,
    );
    return this.serializeHash(passwordBuffer, salt);
  };

  public validatePassword = (password: string, hashPassword: string) => {
    const { params, salt, hash } = this.deserializeHash(hashPassword);

    const passwordBuffer = scryptSync(
      password,
      salt,
      this.KEY_LEN,
      this.SCRYPT_PARAMS,
    );

    return timingSafeEqual(hash, passwordBuffer);
  };
}
