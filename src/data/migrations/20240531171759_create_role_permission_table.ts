import type { Knex } from 'knex';

const TABLE_NAME = 'roles_permissions';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.integer('role_id', 32).unsigned().references('id').inTable('roles');
    table
      .integer('permission_id', 32)
      .unsigned()
      .references('id')
      .inTable('permissions');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME);
}
