import { registerAs } from '@nestjs/config';

export interface Config {
  key: string;
  /** 有效秒數 */
  expiresIn: number;
}

export const Name = 'secret';

export default registerAs(
  Name,
  (): Config => ({
    key: process.env.SERCRET_KEY,
    expiresIn: parseInt(process.env.SERCRET_EXPIRES_IN),
  }),
);
