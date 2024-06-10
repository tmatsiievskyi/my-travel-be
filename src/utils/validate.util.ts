import { INextFunc, IRequest, IResponse } from '@itypes/server.type';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  (req: IRequest, res: IResponse, next: INextFunc) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (err: any) {
      next(err);
    }
  };
