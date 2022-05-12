import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly appService: AppService,
  ) {
    //
  }

  @Get()
  getHello(): string {
    this.loggerService.log(`Hello`);
    this.loggerService.warn(`Hello warn`);
    this.loggerService.error(`Hello error`);

    return this.appService.getHello();
  }
}
