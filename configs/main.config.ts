import { registerAs } from '@nestjs/config';

export interface MainConfig {
  port: number;
  timezone: string;
}

export default registerAs(
  'main',
  (): MainConfig => ({
    port: parseInt(process.env.PORT),
    timezone: 'Asia/Taipei',
  }),
);
