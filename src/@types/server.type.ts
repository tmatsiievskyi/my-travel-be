import { Crypting } from '@utils/crypting.util';
import { FileService } from '@utils/fileService.util';
import { Request, Response, NextFunction, Router } from 'express';
import { Logger } from 'pino';
import { IDataProviders } from './data.type';
import { IDBDate, IUser } from './model.type';

export interface IContainer {
  logger: Logger;
  data: IDataProviders;
  fileService: FileService;
  crypting: Crypting;
}

export interface IFileToSearch {
  path: string;
  suffix: string;
}

export interface IRequest extends Request {
  startTime?: number;
  user?: Omit<IUser & IDBDate, 'password'>;
}

export interface InitIRequest extends Omit<IRequest, 'user'> {}
export interface IResponse extends Response {}
export interface INextFunc extends NextFunction {}
export interface IRouter extends Router {}
