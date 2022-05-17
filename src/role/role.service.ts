import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/logger/logger.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import { Role, RoleDocument } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly utilsService: UtilsService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {
    //
  }

  create(dto: CreateRoleDto) {
    const { name, description, subjects } = dto;

    // 建立資料
    const data: Role = {
      name,
      description,
      subjects,
      timestamp: {
        createdAt: this.utilsService.getUnix(),
      },
    };

    return this.roleModel.create(data);
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
