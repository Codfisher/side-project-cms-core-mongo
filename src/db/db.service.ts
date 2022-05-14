import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Config as DbConfig } from 'configs/db.config';

import { initializeApp, cert } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class DbService {
  private bucket: Bucket;
  private auth: Auth;

  constructor(private configService: ConfigService) {
    const { firebaseServiceAccount } = this.configService.get<DbConfig>('db');

    const storageBucketUrl = `${firebaseServiceAccount.projectId}.appspot.com`;

    initializeApp({
      credential: cert(firebaseServiceAccount),
      storageBucket: storageBucketUrl,
    });

    this.bucket = getStorage().bucket();
    this.auth = getAuth();
  }

  getBucketFile(path: string) {
    return this.bucket.file(path);
  }

  getAuth() {
    return this.auth;
  }
}
