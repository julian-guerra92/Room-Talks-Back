import { Body, Controller, Get, Put, Query, BadRequestException} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersServiceInterface } from "./interface/users-service";


@Controller('users')
export class UsersController {

   constructor(private usersService: UsersServiceInterface) { }

   @Get()
  async getUser(@Query('id') id?: string, @Query('email') email?: string) {
    if (id) {
      return this.usersService.getUserById(id);
    } else if (email) {
      return this.usersService.getUserByEmail(email);
    } else {
      throw new BadRequestException('Either id or email must be provided');
    }
  }

   @Put('update')
   updateUser(@Body() updateUser: UpdateUserDto) {
      return this.usersService.updateUser(updateUser);
   }

}