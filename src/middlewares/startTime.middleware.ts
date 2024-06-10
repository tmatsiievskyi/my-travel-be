import { INextFunc, IRequest, IResponse } from '@itypes/server.type';

export const startTimeMiddleware = (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) => {
  req.startTime = Date.now();
  next();
};
