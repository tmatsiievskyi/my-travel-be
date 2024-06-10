import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { Knex } from 'knex';
import * as process from 'process';
import { faker } from '@faker-js/faker';
import { Crypting } from '../../utils/crypting.util';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const tableName = 'users';
  const defaultPassword = process.env.DEFAULT_PASSWORD as string;
  const crypting = new Crypting();

  const users = await Promise.all(
    Array(10)
      .fill(null)
      .map(async (_, index) => {
        return {
          email: faker.internet.email().toLowerCase(),
          email_verified: knex.fn.now(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          password: crypting.hashPassword(defaultPassword),
        };
      }),
  );

  await knex(tableName).insert(users.map((user) => ({ ...user })));
}
