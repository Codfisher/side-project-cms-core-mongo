import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  username: string;

  @IsOptional()
  name: string;
  @IsOptional()
  firebaseIds: string[];
}
