import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({
    required: true,
  })
  username: string;

  @Prop()
  name: string;
  @Prop()
  firebaseId: string;

  @Prop(
    raw({
      createdAt: { type: Number },
      disabledAt: { type: Number },
      deletedAt: { type: Number },
    }),
  )
  timestamp: Record<string, number>;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
