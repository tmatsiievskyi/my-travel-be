import { IApiResponse } from '@itypes/model.type';

export class Formatter {
  public static formatResp<T>(
    result: any,
    ok: boolean,
    start?: number,
    message?: string,
    total?: number,
  ) {
    let numRecords = 0;
    let errors: string[] | null = null;
    let data = null;

    if (result && result instanceof Array) {
      numRecords = result.length;
      data = result;
    } else if (result && result instanceof Error) {
      errors = [this.errorStringify(result)];
    } else if (result || result === 0) {
      numRecords = 1;
      data = result;
    }

    const resp: IApiResponse<T> = {
      data,
      ok,
      errors,
      message: message ? message : null,
      meta: {
        length: numRecords,
        took: start ? Date.now() - start : 0,
        total: total ? total : numRecords,
      },
    };

    return JSON.stringify(resp);
  }

  public static errorHandler(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified = '[Unable to stringify the thrown value]';
    try {
      stringified = JSON.stringify(value);
    } catch {}

    const error = new Error(`Error value: ${stringified}`);
    return error;
  }

  public static errorStringify(error: Error): string {
    return JSON.stringify(
      Object.assign({}, error, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    );
  }

  public static omitFromObj<
    T extends object,
    K extends Extract<keyof T, string>,
  >(obj: T, ...keys: K[]): Omit<T, K> {
    let result: any = {};
    const excludeSet: Set<string> = new Set(keys);

    for (let key in obj) {
      if (!excludeSet.has(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}
