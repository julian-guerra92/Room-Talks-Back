import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";


export class UpdateUserDto {

   @IsString()
   @IsOptional()
   name: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsOptional()
   address: string;

   @IsString()
   @IsOptional()
   image: string;
}
