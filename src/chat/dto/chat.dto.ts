import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class PrivateChatDto {
   @IsString()
   @IsNotEmpty()
   senderUserId: string;

   @IsString()
   @IsNotEmpty()
   receiverUserId: string;
}

export class PublicChatDto {
   @IsString()
   @IsNotEmpty()
   name: string;

   @IsString()
   @IsNotEmpty()
   description: string;
}