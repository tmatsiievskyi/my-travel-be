import type { Knex } from 'knex';

const TABLE_NAME = 'roles';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
    })
    .raw('CREATE INDEX IDX_role_name on roles(name)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
