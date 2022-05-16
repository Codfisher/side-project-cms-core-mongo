import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import {
  Config as SecretConfig,
  Name as SecretName,
} from 'configs/secret.config';
import { JwtPayload as AuthJwtPayload, RequestUser } from '../auth.type';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const { key } = configService.get(SecretName) as SecretConfig;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token =
            request?.cookies?.['token'] ??
            request?.signedCookies?.['token'] ??
            request?.headers?.['token'] ??
            null;

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: key,
    });
  }

  async validate(payload: JwtPayload & AuthJwtPayload): Promise<RequestUser> {
    const user: RequestUser = {
      id: payload.id,
    };

    return user;
  }
}
