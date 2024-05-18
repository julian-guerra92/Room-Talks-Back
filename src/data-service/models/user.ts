import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<User>;

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

   @Prop({ type: String, enum: UserRole, default: User})
   role: UserRole;

   constructor(
      name: string,
      email: string,
      address: string,
      password: string,
      role: UserRole
    ) {
      this.name = name;
      this.email = email;
      this.address = address;
      this.password = password;
      this.role = role;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);