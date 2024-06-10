import { AppError } from '@exceptions/app.exception';
import HttpStatusCode from '@itypes/httpStatusCode.type';
import { INextFunc, IRequest, IResponse } from '@itypes/server.type';
import { Formatter } from '@utils/formatter.util';
import { logger } from '@utils/logger.util';
import { ZodError } from 'zod';

export const errorMiddleware = (
  error: unknown,
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) => {
  if (error instanceof AppError) {
    logger.warn(error);
    res
      .status(error.status)
      .send(Formatter.formatResp(error, 0, error.message));
  } else if (error instanceof ZodError) {
    logger.warn(error);
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .send(Formatter.formatResp(error.errors, 0, error.message));
  } else {
    const err = Formatter.errorHandler(error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(Formatter.formatResp(err, 0, err.message));
  }
};
