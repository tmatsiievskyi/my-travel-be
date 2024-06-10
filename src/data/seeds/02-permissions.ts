import { EPermissionActionRestriction, IPermission } from '@itypes/model.type';
import { PermissionService } from '@modules/pemission/pemission.service';
import { Knex } from 'knex';

const TABLE_NAME = 'permissions';
const crud = ['create', 'read', 'update', 'delete'];
const initResources = ['auth', 'permissions', 'role', 'user'];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  const permissionService = new PermissionService();
  const crud = ['create', 'read', 'update', 'delete'];

  const adminPermissions = {
    // auth: {
    //   resource: 'auth',
    //   action: 'update:own',
    //   attributes: '*',
    // },
    user: permissionService.generatePermission(
      EPermissionActionRestriction.ANY,
      'user',
      crud,
      { update: '*, !password', read: '*, !password', delete: '*, !password' },
    ),
  };

  console.log(adminPermissions);

  // Inserts seed entries
  //   await knex('table_name').insert([
  //     { id: 1, colName: 'rowValue1' },
  //     { id: 2, colName: 'rowValue2' },
  //     { id: 3, colName: 'rowValue3' },
  //   ]);
}
