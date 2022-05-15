import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Name } from 'configs/main.config';
import * as dayjs from 'dayjs';
import * as utcPlugin from 'dayjs/plugin/utc';
import * as timezonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {
    //
  }

  getUnix() {
    const { timezone } = this.configService.get(Name) as Config;
    return dayjs().tz(timezone).unix();
  }
}
