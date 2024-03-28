/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/data-service/models/user';
import { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Chat>;

export type ChatType = 'private' | 'public';

@Schema()
export class Chat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['private', 'public'] })
  type: ChatType;

  @Prop({ type: [{ type: User }] })
  participants: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);