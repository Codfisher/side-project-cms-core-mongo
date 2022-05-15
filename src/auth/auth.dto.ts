import { IsNotEmpty } from 'class-validator';

export class FirebaseLoginDto {
  @IsNotEmpty({
    message: '$property 不可為空',
  })
  token = '';
}
