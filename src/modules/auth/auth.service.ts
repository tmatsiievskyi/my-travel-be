import { config } from '@config';
import { IUser } from '@itypes/model.type';
import { SignInUserDto, SignUpUserDto } from './dto';
import { UserModel } from 'src/model/user.model';
import { WrongCredentialsException } from '@exceptions/wrongCredentials.exception';
import { Jwt } from '@utils/jwt.util';
import { Crypting } from '@utils/crypting.util';
import { IUserJwt, TokenTypes } from '@itypes/util.types';
import { logger } from '@utils/logger.util';
import { CacheClient } from 'src/data/cache';
import { Cookies } from '@utils/cookies.util';
import { Formatter } from '@utils/formatter.util';
import { BadRequest } from '@exceptions/app.exception';

export class AuthService {
  private crypting = new Crypting();

  public async login(loginData: SignInUserDto) {
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) throw new WrongCredentialsException();

    const passwordMatch = this.crypting.validatePassword(
      loginData.password,
      user.password,
    );
    if (!passwordMatch) throw new WrongCredentialsException();

    const logUserInData = await this.logUserIn(user);

    return {
      user: Formatter.omitFromObj(user, 'password'),
      logUserInData,
    };
  }

  public async register(signUpData: SignUpUserDto) {
    const userAlreadyExist = await UserModel.findByEmail(signUpData.email);
    if (userAlreadyExist) throw new BadRequest('Invalid email or password');

    const hashedPassword = this.crypting.hashPassword(signUpData.password);
    const createdUser = await UserModel;
  }

  private async logUserIn(user: IUser) {
    const access_token = (await Jwt.createJwt<IUserJwt>(
      { data: { id: user.id, email: user.email }, type: TokenTypes.LOGIN },
      config.token.access_token_private_key,
      { expiresIn: `${config.token.access_token_expires}m` },
    )) as string;
    const refresh_token = (await Jwt.createJwt(
      { data: { id: user.id, email: user.email }, type: TokenTypes.LOGIN },
      config.token.refresh_token_private_key,
      { expiresIn: `${config.token.refresh_token_expires}m` },
    )) as string;

    await CacheClient.setString(
      'AUTH_SESSION',
      access_token,
      config.token.access_token_expires * 60,
      user.id,
    );

    await CacheClient.setObj(
      'DATA_USER',
      Formatter.omitFromObj(user, 'password'),
      config.token.access_token_expires * 60,
      user.id,
    );

    logger.info(`User with email ${user.email} just logged in`);

    return {
      access: {
        access_token,
        cookies: Cookies.generateCookies(
          'access_token',
          access_token,
          config.token.access_token_expires,
          { httpOnly: true, sameSite: 'lax' },
        ),
      },
      refresh: {
        refresh_token,
        cookies: Cookies.generateCookies(
          'refresh_token',
          refresh_token,
          config.token.refresh_token_expires,
          { httpOnly: true, sameSite: 'lax' },
        ),
      },
    };
  }
}
