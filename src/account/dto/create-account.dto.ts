import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  username = '';

  @IsNotEmpty({
    message: '$property 不可為空',
  })
  name = '';
  @IsOptional()
  firebaseId?: string;
  @IsOptional()
  password?: string;
}
