import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Subject, UserAction } from '../role.type';

export class SubjectItem {
  @IsEnum(Subject, {
    message: '$property 必須為 Subject 枚舉項目',
  })
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  name = '';

  @IsEnum(UserAction, {
    message: '$property 任一元素必須為 UserAction 枚舉項目',
    each: true,
  })
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  actions!: UserAction[];
}

export class CreateRoleDto {
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  name = '';

  @IsOptional()
  description = '';

  @ValidateNested({ each: true })
  @Type(() => SubjectItem)
  @IsOptional()
  subjects: SubjectItem[] = [];
}
