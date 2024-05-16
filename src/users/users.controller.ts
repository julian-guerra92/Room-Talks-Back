import { Body, Controller, Get, Param, Put} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersServiceInterface } from "./interface/users-service";


@Controller('users')
export class UsersController {

   constructor(private usersService: UsersServiceInterface) { }

   @Get('/:email')
   getUser(@Param('email') email) {
      return this.usersService.getUser(email);
   }
   
   @Put('update')
   updateUser(@Body() updateUser: UpdateUserDto) {
      return this.usersService.updateUser(updateUser);
   }

}