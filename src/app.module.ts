import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mainConfig from 'configs/main.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
}
