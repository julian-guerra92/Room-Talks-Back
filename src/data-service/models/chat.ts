import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/data-service/models/user';

export type ChatDocument = HydratedDocument<Chat>;

export type ChatType = 'private' | 'public';

@Schema()
export class Chat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['private', 'public'] })
  type: ChatType;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: User }] })
  participants: User[];

  @Prop()
  referenceImage?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);