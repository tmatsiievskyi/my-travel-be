import { dataProviders } from '@data';
import { TDBResponce } from '@itypes/model.type';

export abstract class Model {
  static tableName: string;

  private static get table() {
    if (!this.tableName) {
      throw new Error('You must set a table name!');
    }
    return dataProviders.db(this.tableName);
  }

  public static async all<Result>(): Promise<Result[]> {
    return this.table;
  }

  public static async insert<Payload, Result>(
    data: Payload,
  ): TDBResponce<Result> {
    const [result] = await this.table.insert(data).returning('*');
    return result;
  }

  public static async update<Payload, Result>(
    id: string,
    data: Payload,
  ): TDBResponce<Result> {
    const [result] = await this.table.where({ id }).update(data).returning('*');
    return result;
  }

  public static async delete(id: string): Promise<number> {
    return this.table.where({ id }).del();
  }

  public static async findById<Result>(id: string): TDBResponce<Result> {
    return this.table.where('id', id).first();
  }

  public static async findBy<Payload, Result>(
    data: Payload,
  ): TDBResponce<Result | null> {
    return this.table.where(data as string).first();
  }
}
