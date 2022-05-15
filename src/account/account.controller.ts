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
} from '@nestjs/common';
import to from 'await-to-js';

import { LoggerService } from 'src/logger/logger.service';
import { AccountService } from './account.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { FindAllAccountDto } from './dto/find-all-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller()
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
    const [error, result] = await to(this.accountService.create(dto));
    if (error) {
      this.loggerService.error(`建立帳號發生錯誤 : ${error}`);

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
  async findOne(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete('account/:id')
  @Version('1')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
