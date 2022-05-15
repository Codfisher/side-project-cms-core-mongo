export interface VerifyFirebaseIdTokenError {
  key: 'verifyIdToken' | 'getUser';
  message: string;
  info?: any;
}
