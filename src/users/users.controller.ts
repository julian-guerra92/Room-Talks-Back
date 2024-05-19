import { Body, Controller, Get, Put, Query, BadRequestException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersServiceInterface } from "./interface/users-service";
import { FileInterceptor } from "@nestjs/platform-express/multer";


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
  @UseInterceptors(FileInterceptor('file'))
  updateUser(@Body() updateUser: UpdateUserDto, @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'jpeg'
      })
      .addMaxSizeValidator({
        maxSize: 13000
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  )
  file: Express.Multer.File) { return this.usersService.updateUser(updateUser, file); }
}