import { registerAs } from '@nestjs/config';

export interface MainConfig {
  port: number;
}

export default registerAs(
  'main',
  (): MainConfig => ({
    port: parseInt(process.env.PORT),
  }),
);
