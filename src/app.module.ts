import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mainConfig from 'configs/main.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig],
      envFilePath: [`env/${process.env.NODE_ENV ?? 'develop'}.env`],
    }),
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
}
