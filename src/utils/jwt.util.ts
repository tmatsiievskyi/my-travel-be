import { IJwtPayload } from '@itypes/util.types';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export class Jwt {
  private static sign(payload: JwtPayload, key: string, options: SignOptions) {
    return new Promise((res, rej) => {
      try {
        res(
          jwt.sign(payload, key, {
            ...(options && options),
          }),
        );
      } catch (error) {
        rej(error);
      }
    });
  }

  public static verify<T>(token: string, key: string): Promise<{ data: T }> {
    return new Promise((res, rej) => {
      jwt.verify(token, key, (error, decoded) => {
        if (error) {
          rej(error);
        } else {
          res(decoded as { data: T });
        }
      });
    });
  }

  public static async createJwt<T>(
    data: IJwtPayload<T>,
    key: string,
    options: SignOptions = {},
  ) {
    return await this.sign(data, key, options);
  }
}
