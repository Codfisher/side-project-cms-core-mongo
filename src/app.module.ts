import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import mainConfig from 'configs/main.config';
import dbConfig from 'configs/db.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig, dbConfig],
      envFilePath: [`env/${process.env.NODE_ENV ?? 'develop'}.env`],
    }),
    AuthModule,
    LoggerModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
}
