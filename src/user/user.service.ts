import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import { UserRecord } from 'firebase-admin/auth';

import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';

import { GetByIdError, GetByIdParams, User } from './user.type';

@Injectable()
export class UserService {
  constructor(
    private readonly dbService: DbService,
    private readonly loggerService: LoggerService,
    private readonly accountService: AccountService,
  ) {
    //
  }

  async getById({ id }: GetByIdParams) {
    const [findAccountError, account] = await to(
      this.accountService.findById(id),
    );
    if (findAccountError) {
      this.loggerService.error('取得 Account 錯誤');
      this.loggerService.error(findAccountError);

      const error: GetByIdError = {
        key: 'findAccount',
        message: `取得 ${id} Account 錯誤`,
        info: findAccountError,
      };
      return Promise.reject(error);
    }

    if (!account) {
      return undefined;
    }

    const auth = this.dbService.getAuth();
    const tasks = account.firebaseIds.map((id) => auth.getUser(id));
    const results = await Promise.allSettled(tasks);

    const firebaseInfos = results
      .filter(({ status }) => status === 'fulfilled')
      .map((result) => {
        const fulfilledResult = result as PromiseFulfilledResult<UserRecord>;
        return fulfilledResult.value;
      });

    const { _id, username, name, timestamp } = account;

    const user: User = {
      id: _id,
      username,
      name,
      timestamp,
    };

    if (results.length !== 0) {
      user.firebaseInfos = firebaseInfos;
    }

    return user;
  }
}
