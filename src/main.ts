import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { ConfigService } from '@nestjs/config';
import { Config as MainConfig, Name as MainName } from 'configs/main.config';
import {
  Config as SecretConfig,
  Name as SecretName,
} from 'configs/secret.config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const mainConfig = configService.get(MainName) as MainConfig;
  const secretConfig = configService.get(SecretName) as SecretConfig;

  const utilsService = app.get(UtilsService);

  if (!utilsService.isDev()) {
    app.use(helmet());
  }

  app.use(compression());
  app.use(cookieParser(secretConfig.key));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(mainConfig.port);
}
bootstrap();
