export interface GetAccountByFirebaseTokenError {
  key: 'verifyIdToken' | 'getUser';
  message: string;
  info?: Error;
}
