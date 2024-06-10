import { INextFunc, IRequest, IResponse } from '@itypes/server.type';

export const bodyParser = async (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) => {
  const buffers = [];

  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();

  if (req.headers['content-type'] === 'application/json') {
    req.body = JSON.parse(data);
  } else if (
    req.headers['content-type'] === 'application/x-www-form-urlencoded'
  ) {
    const params = new URLSearchParams(data);
    const entries = params.entries();
    req.body = Object.fromEntries(entries);
  }

  next();
};
