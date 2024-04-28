import { Body, Controller, Post, Get, Param, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthServiceInterface } from "./interface/auth-service";


@Controller('auth')
export class AuthController {

   constructor(private authService: AuthServiceInterface) { }

   @Post('register')
   createUser(@Body() createUser: CreateUserDto) {
      return this.authService.createUser(createUser);
   }

   @Get('users/:email')
   getUser(@Param('email') email) {
      return this.authService.getUser(email);
   }
   
   @Put('update')
   updateUser(@Body() updateUser: CreateUserDto) {
      return this.authService.updateUser(updateUser);
   }

}