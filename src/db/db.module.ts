import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
  providers: [DbService],
})
export class DbModule {
  //
}
