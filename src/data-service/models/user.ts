import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
   Admin = 'Admin',
   User = 'User',
}

@Schema()
export class User {

   @Prop()
   name: string;

   @Prop()
   email: string;

   @Prop()
   address: string;

   @Prop()
   password: string;

   @Prop({ type: String, enum: UserRole, default: UserRole.User })
   role: UserRole;

   @Prop()
   image?: String;
}

export const UserSchema = SchemaFactory.createForClass(User);