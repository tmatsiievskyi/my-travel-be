import type { Knex } from 'knex';

const environments: string[] = ['development', 'staging', 'production'];

const connection: Knex.ConnectionConfig = {
  host: process.env.POSTGRES_HOST as string,
  database: process.env.POSTGRES_DB as string,
  user: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
};

const commonConfig: Knex.Config = {
  client: 'pg',
  connection,
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN || 1),
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    createTimeoutMillis: Number(process.env.CREATE_TIMEOUT_MILLIS || 3000),
    acquireTimeoutMillis: Number(process.env.ACQUIRE_TIMEOUT_MILLIS || 30000),
    idleTimeoutMillis: Number(process.env.IDLE_TIMEOUT_MILLIS || 30000),
    reapIntervalMillis: Number(process.env.REAP_INTERVAL_MILLIS || 1000),
    createRetryIntervalMillis: Number(
      process.env.CREATE_RETRY_INTERVAL_MILLIS || 100,
    ),
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

const config: Record<string, Knex.Config> = {
  development: {
    ...commonConfig,
  },
  test: {
    ...commonConfig,
    connection: {
      ...connection,
      database: process.env.POSTGRES_DB_TEST!,
    },
  },
  production: {
    ...commonConfig,
    connection: {
      ...connection,
      ssl: { rejectUnauthorized: false },
    },
  },
};

export default config;
