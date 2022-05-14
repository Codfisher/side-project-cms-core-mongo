import { registerAs } from '@nestjs/config';

export interface Config {
  key: string;
  /** ms 時間字串格式，ex: 1m、9h */
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
