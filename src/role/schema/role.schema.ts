import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubjectItem } from '../dto/create-role.dto';

export type RoleDocument = Role & Document;

export interface RoleTimestamp {
  createdAt: number;
  deletedAt?: number;
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
  subjects!: SubjectItem[];

  @Prop(
    raw({
      createdAt: { type: Number, required: true },
      deletedAt: { type: Number },
    }),
  )
  timestamp!: RoleTimestamp;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
