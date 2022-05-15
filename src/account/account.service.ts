import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import to from 'await-to-js';

import * as flat from 'flat';
import * as bcrypt from 'bcrypt';

import { LoggerService } from 'src/logger/logger.service';
import { UtilsService } from 'src/utils/utils.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { FindAllAccountDto } from './dto/find-all-account.dto';
import { Account, AccountDocument } from './schema/account.schema';
import { CreateError } from './account.type';

@Injectable()
export class AccountService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly utilsService: UtilsService,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {
    //
  }

  /** 建立帳號
   *
   * 詳細錯誤型別為 CreateError
   */
  async create(dto: CreateAccountDto) {
    const { username, name, firebaseId, password } = dto;

    // firebaseId、password 擇一必填
    if (!firebaseId && !password) {
      const error: CreateError = {
        key: 'chooseOneRequired',
        message: 'firebaseId、password 擇一必填',
      };
      return Promise.reject(error);
    }

    // 檢查 username 是否重複
    const [findByUsernameError, existUsername] = await to(
      this.findByUsername(dto.username),
    );
    if (findByUsernameError) {
      const error: CreateError = {
        key: 'findByUsername',
        message: '依 username 取得帳號錯誤',
        info: findByUsernameError,
      };
      return Promise.reject(error);
    }

    if (existUsername) {
      const error: CreateError = {
        key: 'usernameDuplicate',
        message: 'username 已存在，請嘗試其他名稱',
      };
      return Promise.reject(error);
    }

    // 檢查 firebaseId 是否存在
    const [findByFirebaseIdError, existFirebase] = await to(
      this.findByFirebaseId(dto.firebaseId),
    );
    if (findByFirebaseIdError) {
      const error: CreateError = {
        key: 'findByFirebaseId',
        message: '依 firebaseId 取得帳號錯誤',
        info: findByFirebaseIdError,
      };
      return Promise.reject(error);
    }

    if (existFirebase) {
      const error: CreateError = {
        key: 'accountExisted',
        message: '帳號已建立',
      };
      return Promise.reject(error);
    }

    // 建立資料
    const data: Account = {
      username,
      name,
      password: '',
      firebaseIds: [],
      timestamp: {
        createdAt: this.utilsService.getUnix(),
      },
    };

    if (firebaseId) {
      data.firebaseIds.push(firebaseId);
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt);
    }

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

  async findByUsername(username: string) {
    const [err, result] = await to(this.accountModel.find({ username }).exec());
    if (err) {
      return Promise.reject(err);
    }
    const [account] = result;
    return account;
  }

  async findByFirebaseId(id: string) {
    const [err, result] = await to(
      this.accountModel
        .find({
          firebaseIds: id,
        })
        .exec(),
    );
    if (err) {
      return Promise.reject(err);
    }
    const [account] = result;
    return account;
  }

  update(id: string, dto: UpdateAccountDto) {
    const data = flat(dto);
    return this.accountModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.accountModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            'timestamp.deletedAt': this.utilsService.getUnix(),
          },
        },
        { new: true },
      )
      .exec();
  }
}
