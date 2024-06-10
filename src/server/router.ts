import { IController } from '@itypes/modules';
import {
  IContainer,
  IFileToSearch,
  IRequest,
  IResponse,
} from '@itypes/server.type';
import { FileService } from '@utils/fileService.util';
import { Router } from 'express';

export const createRouting = async (controllersPath: IFileToSearch) => {
  const router = Router({ mergeParams: true });
  const fileService = new FileService();
  const routes: Record<string, IController> = {};

  const controllers = await fileService.readDirRecur(
    controllersPath.path,
    controllersPath.suffix,
  );

  for (const { fileName, fullName, filePath } of controllers) {
    const controller = new (await import(filePath)).default(router);

    routes[fileName] = controller;
  }

  return routes;
};
