export interface CreateError {
  key:
    | 'chooseOneRequired'
    | 'findByUsername'
    | 'findByFirebaseId'
    | 'usernameDuplicate'
    | 'accountExisted';
  message: string;
  info?: Error;
}
