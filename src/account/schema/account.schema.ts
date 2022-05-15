import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

interface Timestamp {
  createdAt: number;
  disabledAt?: number;
  deletedAt?: number;
}

@Schema()
export class Account {
  @Prop({
    required: true,
  })
  username: string;
  @Prop({
    default: '',
  })
  password: string;
  @Prop({
    default: [],
  })
  firebaseIds: string[];

  @Prop({
    required: true,
  })
  name: string;

  @Prop(
    raw({
      createdAt: { type: Number, required: true },
      disabledAt: { type: Number },
      deletedAt: { type: Number },
    }),
  )
  timestamp: Timestamp;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
