import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class CreateUserDto {

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   address: string;

   @IsString()
   @IsNotEmpty()
   @IsStrongPassword(
      {  minLength: 8,
         minLowercase: 1,
         minNumbers: 1,
         minSymbols: 1,
         minUppercase: 1
      }
   )
   password: string;

   
}
