import { IController } from '@itypes/modules';
import {
  INextFunc,
  IRequest,
  IResponse,
  IRouter,
  InitIRequest,
} from '@itypes/server.type';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto, signInUserObject } from './dto';
import { logger } from '@utils/logger.util';
import { validate } from '@utils/validate.util';
import { Jwt } from '@utils/jwt.util';
import { Crypting } from '@utils/crypting.util';
import { config } from '@config';
import { Formatter } from '@utils/formatter.util';
import { auhtMiddleware } from 'src/middlewares/auth.middleware';

class AuthController implements IController {
  authService = new AuthService();

  constructor(public readonly router: IRouter) {
    this.router = router;
    this.initRoutes();
  }

  private initRoutes() {
    this.router
      .post('/auth/sign-up', this.singUp)
      .post('/auth/sign-in', validate(signInUserObject), this.signIn)
      .post('/auth/sign-out', auhtMiddleware, this.signOut);
  }

  private singUp(req: IRequest, res: IResponse, next: INextFunc) {
    try {
      const signUpData: SignUpUserDto = req.body;
    } catch (error) {
      next(error);
    }
  }

  private signIn = async (req: IRequest, res: IResponse, next: INextFunc) => {
    try {
      const signInData: SignInUserDto = req.body;
      const { user, logUserInData } = await this.authService.login(signInData);
      res.cookie(
        'access_token',
        logUserInData.access.access_token,
        logUserInData.access.cookies.options,
      );
      res.cookie(
        'refresh_token',
        logUserInData.refresh.refresh_token,
        logUserInData.refresh.cookies.options,
      );
      res.cookie('logged_in', true, logUserInData.access.cookies.options);
      res.send(Formatter.formatResp(user, true, req.startTime, 'ok'));
    } catch (error) {
      next(error);
    }
  };

  private signOut = async (req: IRequest, res: IResponse, next: INextFunc) => {
    res.send('ok');
  };
}

export default AuthController;
