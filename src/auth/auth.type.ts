export interface GetAccountByFirebaseTokenError {
  key: 'verifyIdToken' | 'getUser';
  message: string;
  info?: any;
}
