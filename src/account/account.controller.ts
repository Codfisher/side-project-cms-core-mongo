import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import to from 'await-to-js';

import { LoggerService } from 'src/logger/logger.service';
import { AccountService } from './account.service';
import { CreateError } from './account.type';

import { CreateAccountDto } from './dto/create-account.dto';
import { FindAllAccountDto } from './dto/find-all-account.dto';
import { FindOneAccountDto } from './dto/find-one-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountDocument } from './schema/account.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly accountService: AccountService,
  ) {
    //
  }

  @Post('account')
  @Version('1')
  async create(@Body() dto: CreateAccountDto) {
    const [createError, result] = await to<AccountDocument, CreateError>(
      this.accountService.create(dto),
    );

    if (createError?.key === 'chooseOneRequired') {
      throw new HttpException(
        'FirebaseId 與 password 擇一必填',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createError?.key === 'usernameDuplicate') {
      throw new HttpException(
        'username 已存在，請嘗試其他組合',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createError?.key === 'accountExisted') {
      throw new HttpException('帳號已經存在', HttpStatus.BAD_REQUEST);
    }

    if (createError) {
      this.loggerService.error(`建立帳號發生錯誤 :`);
      this.loggerService.error(createError);

      throw new HttpException(
        '建立帳號發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: result,
    };
  }

  @Get('accounts')
  @Version('1')
  async findAll(@Query() dto: FindAllAccountDto) {
    const [totalError, total] = await to(this.accountService.getTotalNumber());
    if (totalError) {
      this.loggerService.error(`取得 account 總數錯誤 : ${totalError}`);

      throw new HttpException(
        '取得資料發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { skip = 0, limit = 10 } = dto;

    const [findError, data] = await to(
      this.accountService.findAll({ skip, limit }),
    );
    if (findError) {
      this.loggerService.error(`accountService.findAll() 錯誤 : ${findError}`);

      throw new HttpException(
        '取得資料發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  @Get('account/:id')
  @Version('1')
  async findOne(@Param() { id }: FindOneAccountDto) {
    const [error, result] = await to(this.accountService.findById(id));

    if (error) {
      this.loggerService.error(`查詢帳號 ID ${id} 錯誤 : ${error}`);

      throw new HttpException(
        '取得資料發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: result,
    };
  }

  @Patch('account/:id')
  @Version('1')
  async update(
    @Param() { id }: FindOneAccountDto,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const [error, result] = await to(
      this.accountService.update(id, updateAccountDto),
    );

    if (error) {
      this.loggerService.error(`更新資料 ${id} 錯誤 : ${error}`);

      throw new HttpException(
        '更新資料發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: result,
    };
  }

  @Delete('account/:id')
  @Version('1')
  async remove(@Param() { id }: FindOneAccountDto) {
    const [error, result] = await to(this.accountService.remove(id));

    if (error) {
      this.loggerService.error(`刪除帳號 ID ${id} 錯誤 : ${error}`);

      throw new HttpException(
        '刪除資料發生錯誤，請稍後再試',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: result,
    };
  }
}
