import { Body, Controller, Post } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { AuthServiceInterface } from "./interface/auth-service";


@Controller('auth')
export class AuthController {

   constructor(private authService: AuthServiceInterface) { }

   @Post('register')
   createUser(@Body() createUSer: CreateUserDto) {
      return this.authService.createUser(createUSer);
   }

}