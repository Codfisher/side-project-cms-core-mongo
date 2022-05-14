import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import to from 'await-to-js';

import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';

import { FirebaseLoginDto } from './auth.dto';
import { GetAccountByFirebaseTokenError } from './auth.type';
import { UserRecord } from 'firebase-admin/auth';

@Controller()
export class AuthController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly authService: AuthService,
  ) {
    //
  }

  @Version('1')
  @Post('/auth/firebase')
  async login(@Body() { token }: FirebaseLoginDto) {
    const [err, user] = await to<UserRecord, GetAccountByFirebaseTokenError>(
      this.authService.getAccountByFirebaseToken(token),
    );
    if (err?.key === 'verifyIdToken') {
      this.loggerService.warn(`Firebase Token 解析錯誤 : ${err.info}`);

      throw new HttpException(
        `登入錯誤，請確認 Token 有效或稍後再試`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (err) {
      this.loggerService.error(`${err.message} : ${err.info}`);
      throw new HttpException(
        `發生異常稍後再試`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }
}
