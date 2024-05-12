import { IsNotEmpty, IsString } from "class-validator";

export class PrivateChatDto {
   @IsString()
   @IsNotEmpty()
   senderUserId: string;

   @IsString()
   @IsNotEmpty()
   receiverUserId: string;
}