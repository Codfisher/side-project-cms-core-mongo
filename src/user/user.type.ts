import { UserRecord } from 'firebase-admin/auth';
import { AccountTimestamp } from 'src/account/schema/account.schema';

export interface GetByIdParams {
  /** Mongo Object ID */
  id: string;
}

export interface GetByIdError {
  key: 'findAccount';
  message: string;
  info?: any;
}

export interface User {
  /** Mongo Object ID */
  id: string;
  username: string;
  name: string;
  firebaseInfos?: UserRecord[];
  timestamp: AccountTimestamp;
}
