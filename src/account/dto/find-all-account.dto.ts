import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindAllAccountDto {
  @Min(0, {
    message: '$property 不可小於 0',
  })
  @IsInt({
    message: '$property 必須為正整數',
  })
  @Type(() => Number)
  @IsOptional()
  skip = 0;

  @Min(0, {
    message: '$property 不可小於 0',
  })
  @IsInt({
    message: '$property 必須為正整數',
  })
  @Type(() => Number)
  @IsOptional()
  limit = 30;
}
