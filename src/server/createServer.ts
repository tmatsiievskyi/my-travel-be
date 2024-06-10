import { config } from '@config';
import { ExpressServer } from './expressServer';
import { createRouting } from './router';
import { IFileToSearch } from '@itypes/server.type';
import { connect as ConnectCache } from '../data/cache';
import { logger } from '@utils/logger.util';

export const createServer = async () => {
  const controllersPath: IFileToSearch = {
    path: process.cwd() + '/src/modules',
    suffix: '.controller.ts',
  } as const;

  try {
    await ConnectCache();
    const routes = await createRouting(controllersPath);

    const appServer = new ExpressServer(config, routes);

    return appServer;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
