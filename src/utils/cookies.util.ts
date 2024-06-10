import { ICookiesOptions } from '@itypes/util.types';

export class Cookies {
  public static generateCookiesOptions = (
    expires: number,
    cookiesOptions: ICookiesOptions,
  ): ICookiesOptions => ({
    expires: new Date(Date.now() + expires * 60 * 1000),
    maxAge: expires * 60 * 10000,
    ...cookiesOptions,
  });

  public static generateCookies = (
    name: string,
    value: string,
    expires: number,
    options: ICookiesOptions,
  ) => ({
    [name]: value,
    options: this.generateCookiesOptions(expires, { ...options }),
  });
}
