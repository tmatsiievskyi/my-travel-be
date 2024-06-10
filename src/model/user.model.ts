import { IUser } from '@itypes/model.type';
import { Model } from './_base.model';

export class UserModel extends Model {
  public static tableName: string = 'users';

  public static findByEmail(email: string): Promise<IUser> {
    return this.findBy<
      {
        email: string;
      },
      IUser
    >({ email });
  }
}
