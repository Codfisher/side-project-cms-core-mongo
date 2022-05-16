import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(id: string, password: string) {
    const user = await this.authService.validateLocalAccount(id, password);

    if (!user) {
      throw new HttpException('帳號密碼錯誤', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
