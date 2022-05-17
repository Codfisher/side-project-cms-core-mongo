export enum UserAction {
  /** CASL 保留字，表示任何動作 */
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Subject {
  /** CASL 保留字，表示任何主題 */
  ALL = 'all',
  ACCOUNT = 'account',
  USER = 'user',
  ROLE = 'role',
}
