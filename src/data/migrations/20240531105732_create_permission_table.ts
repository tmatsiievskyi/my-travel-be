import type { Knex } from 'knex';

const TABLE_NAME = 'permissions';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (table) => {
      table.increments('id');
      table.string('resource').notNullable();
      table.string('action').notNullable();
      table.string('attributes').notNullable();
    })
    .raw(
      'ALTER TABLE permissions ADD CONSTRAINT UQ_permission UNIQUE(resource, action, attributes)',
    );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
