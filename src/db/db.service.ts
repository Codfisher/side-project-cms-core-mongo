import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { DbConfig } from 'configs/db.config';

import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class DbService {
  bucket: Bucket;

  constructor(private configService: ConfigService) {
    const { firebaseServiceAccount } = this.configService.get<DbConfig>('db');

    const storageBucketUrl = `${firebaseServiceAccount.projectId}.appspot.com`;

    initializeApp({
      credential: cert(firebaseServiceAccount),
      storageBucket: storageBucketUrl,
    });

    this.bucket = getStorage().bucket();
  }

  getBucketFile(path: string) {
    return this.bucket.file(path);
  }
}
