import { Module } from '@nestjs/common';
import { join } from 'path';

import { ConfigModule } from '@nestjs/config';
import mainConfig from 'configs/main.config';
import dbConfig from 'configs/db.config';
import secretConfig from 'configs/secret.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'client',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig, dbConfig, secretConfig],
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
