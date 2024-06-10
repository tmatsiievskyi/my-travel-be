import express, { Application } from 'express';
import {
  frameguard,
  hidePoweredBy,
  hsts,
  ieNoOpen,
  noSniff,
  xssFilter,
} from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { TConfig } from '@config';
import { IController } from '@itypes/modules';
import { bodyParser } from 'src/middlewares/bodyParse.middleware';
import { logger } from '@utils/logger.util';
import { errorMiddleware } from 'src/middlewares/error.middleware';
import { startTimeMiddleware } from 'src/middlewares/startTime.middleware';

export class ExpressServer {
  private readonly server: Application = express();

  constructor(
    private readonly config: TConfig,
    private readonly routes: Record<string, IController>,
  ) {}

  private initSecurity() {
    this.server.use(frameguard());
    this.server.use(hidePoweredBy());
    this.server.use(hsts());
    this.server.use(ieNoOpen());
    this.server.use(noSniff());
    this.server.use(xssFilter());
  }

  private initMiddleware() {
    this.server.use(bodyParser);
    this.server.use(cookieParser());
    this.server.use(cors());
    this.server.use(startTimeMiddleware);
  }

  private initRouting() {
    for (const [name, controller] of Object.entries(this.routes)) {
      this.server.use(`/api/v1`, controller.router);
    }
  }

  private initErrorHandling() {
    this.server.use(errorMiddleware);
  }

  public async startServer() {
    try {
      this.initSecurity();
      this.initMiddleware();
      this.initRouting();
      this.initErrorHandling();

      this.server.use((_, res) => {
        return res.status(404).json({ message: 'Not Found' }); //TODO: fix
      });

      this.server.listen(this.config.server.port, () =>
        logger.info(`App listen port: ${this.config.server.port}`),
      );
    } catch (error) {
      logger.error(`Failed to start server: ${error}`);
      process.exit(1);
    }
  }
}
