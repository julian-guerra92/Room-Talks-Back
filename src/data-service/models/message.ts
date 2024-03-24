/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document{
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