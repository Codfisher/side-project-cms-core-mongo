import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

import { LoggingWinston } from '@google-cloud/logging-winston';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [new LoggingWinston()],
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  //
}
