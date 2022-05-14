import { registerAs } from '@nestjs/config';

export interface Config {
  port: number;
  timezone: string;
}

export default registerAs(
  'main',
  (): Config => ({
    port: parseInt(process.env.PORT),
    timezone: 'Asia/Taipei',
  }),
);
