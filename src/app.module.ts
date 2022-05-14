import { Module } from '@nestjs/common';

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
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';

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
    UserModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
}
