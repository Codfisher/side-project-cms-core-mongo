import { registerAs } from '@nestjs/config';

export interface Config {
  key: string;
  /** 有效時間 */
  expiresIn: string;
}

export const Name = 'secret';

export default registerAs(
  Name,
  (): Config => ({
    key: process.env.SERCRET_KEY,
    expiresIn: process.env.SERCRET_EXPIRES_IN,
  }),
);
