import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ConfigService } from '@nestjs/config';
import { Config as MainConfig } from 'configs/main.config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(compression());
  app.use(helmet());
  // app.use(cookieParser(config().token.secret));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const { port } = configService.get<MainConfig>('main');

  await app.listen(port);
}
bootstrap();
