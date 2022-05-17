import {
  Controller,
  Post,
  Body,
  Delete,
  Version,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import to from 'await-to-js';
import { Response } from 'express';

import { FirebaseLoginDto } from './auth.dto';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';
import { AccountService } from 'src/account/account.service';
import { AccountDocument } from 'src/account/schema/account.schema';
import { ReqUser } from 'src/common/req-user.decorator';
import { RequestUser } from './auth.type';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {
    //
  }

  @Version('1')
  @UseGuards(LocalAuthGuard)
  @Post('/auth/local')
  async localLogin(
    @ReqUser() user: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 取得帳號
    const [error, account] = await to(this.accountService.findById(user.id));
    if (error) {
      this.loggerService.error('取得帳號失敗');
      this.loggerService.error(error);
      throw new HttpException(
        `登入錯誤，請稍後再試`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!account) {
      throw new HttpException(`帳號不存在`, HttpStatus.BAD_REQUEST);
    }

    const options = this.authService.getCookieOptions();
    const tokenData = this.authService.getJwtToken(account);

    res.cookie('token', tokenData.token, options);

    return {
      data: tokenData.token,
    };
  }

  @Version('1')
  @Post('/auth/firebase')
  async firebaseLogin(
    @Body() { token }: FirebaseLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [error, decodedData] = await to(
      this.authService.verifyFirebaseIdToken(token),
    );
    if (error) {
      this.loggerService.warn('解析 Firebase ID Token 失敗');
      this.loggerService.warn(error);
      throw new HttpException(
        `Token 解析失敗，請確認 Token 有效性`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 檢查是否已建立帳號
    const [existedError, existedAccount] = await to(
      this.accountService.findByFirebaseId(decodedData.uid),
    );
    if (existedError) {
      this.loggerService.error('檢查是否已建立帳號失敗');
      this.loggerService.error(existedError);
      throw new HttpException(
        `登入錯誤，請稍後再試`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let targetAccount = existedAccount;

    // 是否已存在帳號
    if (!existedAccount) {
      // 自動建立帳號
      const params: CreateAccountDto = {
        username: '',
        name: decodedData?.name ?? '',
        firebaseId: decodedData.uid,
      };

      const [createError, newAccount] = await to(
        this.accountService.create(params),
      );
      if (createError) {
        this.loggerService.error('自動建立帳號錯誤');
        this.loggerService.error(createError);
        throw new HttpException(
          `登入錯誤，請稍後再試`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      targetAccount = newAccount;
    }

    const account = targetAccount as AccountDocument;

    const options = this.authService.getCookieOptions();
    const tokenData = this.authService.getJwtToken(account);

    res.cookie('token', tokenData.token, options);

    return {
      data: tokenData.token,
    };
  }

  @Version('1')
  @Delete('/auth')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
  }
}
