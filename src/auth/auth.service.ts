import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import * as ms from 'ms';
import * as bcrypt from 'bcrypt';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';

import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'src/utils/utils.service';

import { Config as MainConfig, Name as MainName } from 'configs/main.config';
import {
  Config as SecretConfig,
  Name as SecretName,
} from 'configs/secret.config';
import { CookieOptions } from 'express';
import { AccountDocument } from 'src/account/schema/account.schema';
import { AccountService } from 'src/account/account.service';
import { JwtPayload, RequestUser } from './auth.type';

@Injectable()
export class AuthService {
  private auth: Auth;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
    private readonly utilsService: UtilsService,
  ) {
    this.auth = this.dbService.getAuth();
  }

  async validateLocalAccount(username: string, password: string) {
    const account = await this.accountService.findByUsername(username);

    if (!account) {
      return undefined;
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (isMatch) {
      return account;
    }

    return undefined;
  }

  async verifyFirebaseIdToken(token: string) {
    const [error, decodedResult] = await to<DecodedIdToken, FirebaseError>(
      this.auth.verifyIdToken(token),
    );

    if (error) {
      return Promise.reject(error);
    }

    return decodedResult;
  }

  getJwtToken(account: AccountDocument) {
    const payload: JwtPayload = {
      id: account._id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  getCookieOptions() {
    const { expiresIn } = this.configService.get(SecretName) as SecretConfig;

    const result: CookieOptions = {
      path: '/',
      signed: true,
      secure: !this.utilsService.isDev(), // https Only
      httpOnly: true,
      maxAge: ms(expiresIn),
    };

    return result;
  }
}
