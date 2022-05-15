import { registerAs } from '@nestjs/config';

export interface Config {
  port: number;
  timezone: string;
}

export const Name = 'main';

export default registerAs(
  Name,
  (): Config => ({
    port: parseInt(process.env.PORT ?? '8080'),
    timezone: 'Asia/Taipei',
  }),
);
