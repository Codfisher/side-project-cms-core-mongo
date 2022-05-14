import { registerAs } from '@nestjs/config';

export interface Config {
  key: string;
  /** 有效秒數 */
  expiresIn: number;
}

export default registerAs(
  'secret',
  (): Config => ({
    key: process.env.SERCRET_KEY,
    expiresIn: parseInt(process.env.SERCRET_EXPIRES_IN),
  }),
);
