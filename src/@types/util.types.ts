import { CookieOptions } from 'express';
import { CacheClient } from 'src/data/cache';

export interface IReadDirRecur {
  fileName: string;
  fullName: string;
  filePath: string;
}

export enum TokenTypes {
  LOGIN = 'login',
  EMAIL = 'email',
}

export interface IUserJwt {
  id: string;
  email: string;
}

export interface IJwtPayload<T> {
  data: T;
  type: TokenTypes;
}

export interface ICookiesOptions extends CookieOptions {}

export type TCacheStringKeys = keyof typeof CacheClient.STRING_KEYS;
export type TCacheObjKeys = keyof typeof CacheClient.OBJ_KEYS;
