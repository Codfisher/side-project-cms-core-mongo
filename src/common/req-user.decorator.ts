/**
 * 用於取得 request 中解析完成之 user
 * AuthGuard('jwt') 之 user 內容請見 jwt.strategy
 * AuthGuard('local') 之 user 內容請見 local.strategy
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.type';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
