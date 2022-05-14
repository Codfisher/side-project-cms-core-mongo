import { registerAs } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';

export interface Config {
  firebaseServiceAccount: ServiceAccount;
}

export const Name = 'db';

export default registerAs(Name, (): Config => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const keyFile = require(`${process.cwd()}/${
    process.env.FIREBASE_PRIVATE_KEY_PATH
  }`);

  const firebaseServiceAccount: ServiceAccount = {
    projectId: keyFile.project_id,
    clientEmail: keyFile.client_email,
    privateKey: keyFile.private_key,
  };

  return {
    firebaseServiceAccount,
  };
});
