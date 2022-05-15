import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {
    //
  }

  private isDev() {
    return process.env.NODE_ENV !== 'production';
  }

  log(message: any) {
    if (this.isDev()) {
      this.logger.log(message);
      return;
    }

    this.winstonLogger.info(message);
  }

  warn(message: any) {
    if (this.isDev()) {
      this.logger.warn(message);
      return;
    }

    this.winstonLogger.warn(message);
  }

  error(message: any) {
    if (this.isDev()) {
      this.logger.error(message);
      return;
    }

    this.winstonLogger.error(message);
  }
}
