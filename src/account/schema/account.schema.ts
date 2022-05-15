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
    type: String,
    default: '',
  })
  username = '';
  @Prop({
    type: String,
    default: '',
  })
  password = '';
  @Prop({
    type: Array,
    default: [],
  })
  firebaseIds: string[] = [];

  @Prop({
    type: String,
    required: true,
  })
  name = '';

  @Prop(
    raw({
      createdAt: { type: Number, required: true },
      disabledAt: { type: Number },
      deletedAt: { type: Number },
    }),
  )
  timestamp!: Timestamp;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
