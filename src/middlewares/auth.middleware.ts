import { AuthTokenError } from '@exceptions/app.exception';
import { INextFunc, IResponse, IRequest } from '@itypes/server.type';
import { Jwt } from '@utils/jwt.util';
import { config } from '@config';
import { CacheClient } from 'src/data/cache';
import { IUser } from '@itypes/model.type';
import { IUserJwt } from '@itypes/util.types';
import { UserService } from '@modules/user/user.service';

export const auhtMiddleware = async (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) => {
  try {
    let access_token;
    const userService = new UserService();
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AuthTokenError());
    }

    const decodedToken = await Jwt.verify<IUserJwt>(
      access_token,
      config.token.access_token_private_key,
    );
    if (!decodedToken) {
      return next(new AuthTokenError());
    }

    const session = await CacheClient.getString(
      'AUTH_SESSION',
      decodedToken.data.id,
    );
    // console.log({ session });

    const user = await userService.getOne(decodedToken.data.id);
    if (!user) {
      return next(new AuthTokenError());
    }
    req.user = user;
    next();
  } catch (error) {
    next(new AuthTokenError());
  }
};
