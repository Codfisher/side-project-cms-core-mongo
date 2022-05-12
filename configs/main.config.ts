import { registerAs } from '@nestjs/config';

export interface MainConfig {
  port: number;
}

export default registerAs(
  'main',
  (): MainConfig => ({
    port: 8080,
  }),
);
