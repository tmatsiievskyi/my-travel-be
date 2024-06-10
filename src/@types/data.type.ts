import { Knex } from 'knex';

export interface IDataProviders {
  db: Knex<any, unknown[]>;
}
