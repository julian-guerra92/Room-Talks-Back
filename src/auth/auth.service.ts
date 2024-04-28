import { Injectable, Logger } from "@nestjs/common";

import { AuthServiceInterface } from "./interface/auth-service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "src/data-service/models/user";
import { DataServiceInterface } from "src/data-service/interface/data-service.interface";


@Injectable()
export class AuthServiceAdapter implements AuthServiceInterface {

   private readonly logger: Logger = new Logger(AuthServiceAdapter.name);

   constructor(
      private readonly dataService: DataServiceInterface
   ) { }

   async createUser(createUser: CreateUserDto): Promise<User> {
      this.logger.log(`Creating user: ${createUser.name}`);
      const user = await this.dataService.users.add(createUser);
      return user;
   }

   async getUser(email: string): Promise<User> {
      this.logger.log(`Getting user: ${email}`);
      const user = await this.dataService.users.getByEmail(email);
      return user;
   }

   async updateUser(entity: CreateUserDto): Promise<User> {
      this.logger.log(`Updating user: ${entity.name}`);
      const user = await this.dataService.users.updateByEmail(entity.email, entity);
      return user;
   }
}