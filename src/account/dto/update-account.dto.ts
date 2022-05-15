import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(
  PickType(CreateAccountDto, ['name']),
) {
  //
}
