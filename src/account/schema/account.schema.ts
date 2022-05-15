import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

interface Timestamp {
  createdAt: number;
  disabledAt: number | null;
  deletedAt: number | null;
}

@Schema()
export class Account {
  @Prop({
    required: true,
  })
  username: string;

  @Prop()
  name: string;
  @Prop()
  firebaseIds: string[];

  @Prop(
    raw({
      createdAt: { type: Number, required: true },
      disabledAt: { type: Number, default: null },
      deletedAt: { type: Number, default: null },
    }),
  )
  timestamp: Timestamp;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
