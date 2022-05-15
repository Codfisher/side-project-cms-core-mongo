import { IsNotEmpty } from 'class-validator';
import { IsMongoObjectId } from 'src/common/validation.decorator';

export class FindOneAccountDto {
  @IsMongoObjectId()
  @IsNotEmpty()
  id: string;
}
