import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersServiceInterface } from "./interface/users-service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "src/data-service/models/user";
import { DataServiceInterface } from "src/data-service/interface/data-service.interface";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class UsersServiceAdapter implements UsersServiceInterface {

   private readonly logger: Logger = new Logger(UsersServiceAdapter.name);

   constructor(
      private readonly dataService: DataServiceInterface
   ) { }

   async getUserByEmail(email: string): Promise<User> {
      this.logger.log(`Getting user: ${email}`);
      return await this.dataService.users.getByEmail(email);
   }

   async getUserById(id: string): Promise<User> {
      this.logger.log(`Getting user: ${id}`);
      return await this.dataService.users.getById(id);
   }

   async updateUser(entity: UpdateUserDto, image: Express.Multer.File): Promise<User> {
      this.logger.log(`Updating user: ${entity.name}`);
      return await this.dataService.users.updateByEmail(entity.email, entity, image);
   }

   async updatePassword(entity: UpdatePasswordDto): Promise<User> {
      this.logger.log(`Updating password: ${entity.id}`);
      const user = await this.dataService.users.getById(entity.id);
      if (user.password !== entity.oldPassword) {
         throw new UnauthorizedException('Invalid old password');
      }
      return await this.dataService.users.updatePassword(entity.id, entity);
   }
}
