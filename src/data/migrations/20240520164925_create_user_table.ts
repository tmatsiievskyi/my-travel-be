import type { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable(tableName, function (table) {
      table.uuid('id').defaultTo(knex.fn.uuid()).primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email').unique();
      table.datetime('email_verified');
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .raw(
      `CREATE INDEX idx_user_full_name ON "users" USING gin((first_name || ' ' || last_name) gin_trgm_ops)`,
    );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
