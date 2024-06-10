import { IUser, TDBResponce } from '@itypes/model.type';
import { Formatter } from '@utils/formatter.util';
import { CacheClient } from 'src/data/cache';
import { UserModel } from 'src/model/user.model';

export class UserService {
  public async getOne(id: string) {
    const cachedUser = await CacheClient.getObj<TDBResponce<IUser>>(
      'DATA_USER',
      id,
    );
    if (cachedUser) return cachedUser;

    const dbUser = await UserModel.findById<IUser>(id);
    if (dbUser) {
      return Formatter.omitFromObj(dbUser, 'password');
    }

    return null;
  }
}
