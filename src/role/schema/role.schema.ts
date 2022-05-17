import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subject, UserAction } from '../role.type';

export type RoleDocument = Role & Document;

export interface RoleTimestamp {
  createdAt: number;
  deletedAt?: number;
}

export interface AllowSubject {
  name: Subject;
  actions: UserAction[];
}

@Schema()
export class Role {
  @Prop({
    type: String,
    default: '',
  })
  name = '';
  @Prop({
    type: String,
    default: '',
  })
  description = '';

  @Prop({
    type: Array,
    default: [],
  })
  subjects!: AllowSubject[];

  @Prop(
    raw({
      createdAt: { type: Number, required: true },
      deletedAt: { type: Number },
    }),
  )
  timestamp!: RoleTimestamp;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
