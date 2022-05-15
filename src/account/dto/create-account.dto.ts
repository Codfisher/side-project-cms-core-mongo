import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  username: string;

  @IsNotEmpty({
    message: '$property 不可為空',
  })
  name: string;
  @IsOptional()
  firebaseId?: string;
  @IsOptional()
  password?: string;
}
