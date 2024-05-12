/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop()
    content: string;
    @Prop()
    senderId: string;
    @Prop()
    IdChat: string;
    @Prop()
    timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);