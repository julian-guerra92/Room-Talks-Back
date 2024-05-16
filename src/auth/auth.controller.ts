import { Body, Controller, Post, Get, Param, Put, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthServiceInterface } from "./interface/auth-service";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {

   constructor(private authService: AuthServiceInterface) { }

   @Post('register')
   createUser(@Body() createUser: CreateUserDto) {
      return this.authService.createUser(createUser);
   }

   @HttpCode(HttpStatus.OK)
   @Post('login')
   signIn(@Body() signInDto: LoginDto) {
     return this.authService.signIn(signInDto.email, signInDto.password);
   }
   
}