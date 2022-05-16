export interface VerifyFirebaseIdTokenError {
  key: 'verifyIdToken' | 'getUser';
  message: string;
  info?: any;
}

/** 被 passport 嵌入 request 中的 user 物件 */
export interface RequestUser {
  id: string;
}
