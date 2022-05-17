import { Module } from '@nestjs/common';
import { join } from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import mainConfig from 'configs/main.config';
import dbConfig, {
  Name as DbName,
  Config as DbConfig,
} from 'configs/db.config';
import secretConfig from 'configs/secret.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';

import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from './utils/utils.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig, dbConfig, secretConfig],
      envFilePath: [`env/${process.env.NODE_ENV ?? 'develop'}.env`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { mongoDbUri: uri } = configService.get(DbName) as DbConfig;

        return {
          uri,
        };
      },
    }),
    PassportModule,
    AuthModule,
    LoggerModule,
    DbModule,
    UserModule,
    AccountModule,
    UtilsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
}
