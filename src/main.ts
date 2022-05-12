import { ConfigService } from '@nestjs/config';
import { MainConfig } from 'configs/main.config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { port } = configService.get<MainConfig>('main');

  console.log(port);

  await app.listen(port);
}
bootstrap();
