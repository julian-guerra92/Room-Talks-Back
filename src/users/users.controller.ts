import { Body, Controller, Get, Put, Query, BadRequestException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersServiceInterface } from "./interface/users-service";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { User } from "src/data-service/models";


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
  
  @Get('get-all')
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  updateUser(
    @Body() updateUser: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<User> {
    return this.usersService.updateUser(updateUser, file);
  }

  @Put('update-password')
  updatePassword(@Body() updatePassword: UpdatePasswordDto) {
    return this.usersService.updatePassword(updatePassword);
  }
}