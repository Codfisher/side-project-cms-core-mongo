import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import { Auth } from 'firebase-admin/auth';

import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';
import { GetAccountByFirebaseTokenError } from './auth.type';

@Injectable()
export class AuthService {
  private auth: Auth;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
  ) {
    this.auth = this.dbService.getAuth();
  }

  async getAccountByFirebaseToken(token: string) {
    const [verifyError, decodedResult] = await to(
      this.auth.verifyIdToken(token),
    );
    if (verifyError) {
      const error: GetAccountByFirebaseTokenError = {
        key: 'verifyIdToken',
        message: 'Firebase Token 解析錯誤',
        info: verifyError,
      };
      return Promise.reject(error);
    }

    const [getUserError, user] = await to(this.auth.getUser(decodedResult.uid));
    if (verifyError) {
      const error: GetAccountByFirebaseTokenError = {
        key: 'getUser',
        message: '取得 Firebase user 錯誤',
        info: getUserError,
      };
      return Promise.reject(error);
    }

    return user;
  }
}
