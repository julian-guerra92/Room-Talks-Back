import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class UpdateUserDto {

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   address: string;
}
