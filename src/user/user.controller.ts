import {
  Controller,
  Get,
  UseGuards,
  Version,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import to from 'await-to-js';

import { UserService } from './user.service';
import { RequestUser } from 'src/auth/auth.type';
import { ReqUser } from 'src/common/req-user.decorator';
import { GetByIdError, User } from './user.type';
import { LoggerService } from 'src/logger/logger.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly userService: UserService,
  ) {
    //
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Get('/user/self')
  async getSelf(@ReqUser() { id }: RequestUser) {
    const [error, user] = await to<User | undefined, GetByIdError>(
      this.userService.getById({ id }),
    );
    if (error) {
      this.loggerService.error('取得帳號資料失敗');
      this.loggerService.error(error);
      throw new HttpException(
        `取得帳號資料失敗`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      this.loggerService.warn('取得帳號資料失敗');
      throw new HttpException(
        `取得帳號資料失敗，請重新登入`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }
}
