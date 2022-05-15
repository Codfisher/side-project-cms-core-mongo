import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as dayjs from 'dayjs';
import * as flat from 'flat';

import { LoggerService } from 'src/logger/logger.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { FindAllAccountDto } from './dto/find-all-account.dto';
import { Account, AccountDocument } from './schema/account.schema';

@Injectable()
export class AccountService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {
    //
  }

  create(dto: CreateAccountDto) {
    const { username, name = '', firebaseIds = [] } = dto;

    const data: Account = {
      username,
      name,
      firebaseIds,
      timestamp: {
        createdAt: dayjs().unix(),
      },
    };

    return this.accountModel.create(data);
  }

  getTotalNumber() {
    return this.accountModel
      .countDocuments({
        'timestamp.deletedAt': {
          $exists: false,
        },
      })
      .exec();
  }

  findAll(dto: FindAllAccountDto) {
    const { skip, limit } = dto;
    return this.accountModel
      .find({
        'timestamp.deletedAt': {
          $exists: false,
        },
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  findById(id: string) {
    return this.accountModel.findById(id).exec();
  }

  update(id: string, dto: UpdateAccountDto) {
    const data = flat(dto);
    return this.accountModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  remove(id: string) {
    return `This action removes a #${id} account`;
  }
}
