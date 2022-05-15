import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { LoggerService } from 'src/logger/logger.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schema/account.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {
    //
  }

  create(dto: CreateAccountDto) {
    const { username, name = '', firebaseId = '' } = dto;

    const data: Account = {
      username,
      name,
      firebaseId,
      timestamp: {
        createdAt: dayjs().unix(),
      },
    };

    return this.accountModel.create(data);
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
