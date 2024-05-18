import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class UpdatePasswordDto {

   @IsString()
   @IsNotEmpty()
   id: string;


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
   oldPassword: string;

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
   newPassword: string;
}
