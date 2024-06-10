import Knex from 'knex';
import { TConfig } from '@config';
import { IDataProviders } from '@itypes/data.type';
import dbConfigs from './knexfile';
import { config } from '@config';

export const dataProviders: IDataProviders = {
  db: Knex(dbConfigs[config.server.nodeEnv]),
};
