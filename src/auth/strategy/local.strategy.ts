import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestUser } from '../auth.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(id: string, password: string): Promise<RequestUser> {
    const account = await this.authService.validateLocalAccount(id, password);

    if (!account) {
      throw new HttpException('帳號密碼錯誤', HttpStatus.BAD_REQUEST);
    }

    const user: RequestUser = {
      id: account.id,
    };

    return user;
  }
}
