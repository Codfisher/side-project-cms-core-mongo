import { registerAs } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';

export interface Config {
  firebaseServiceAccount: ServiceAccount;
  mongoDbUri: string;
}

export const Name = 'db';

export default registerAs(Name, (): Config => {
  const path = process.env.FIREBASE_PRIVATE_KEY_PATH;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const keyFile = require(`${process.cwd()}/${path}`);

  const firebaseServiceAccount: ServiceAccount = {
    projectId: keyFile.project_id,
    clientEmail: keyFile.client_email,
    privateKey: keyFile.private_key,
  };

  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const resource = process.env.MONGO_RESOURCE;
  const mongoDbUri = `mongodb+srv://${username}:${password}@${resource}`;

  return {
    firebaseServiceAccount,
    mongoDbUri,
  };
});
