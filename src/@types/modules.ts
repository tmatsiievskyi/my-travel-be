import { Jwt } from '@utils/jwt.util';
import { IRouter } from './server.type';
import { Logger } from 'pino';
import { Crypting } from '@utils/crypting.util';

export interface IController {
  router: IRouter;
}

export interface IJwt extends Jwt {}
export interface ILogger extends Logger {}
export interface ICrypting extends Crypting {}
