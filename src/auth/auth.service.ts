import { Injectable, Logger } from "@nestjs/common";

import { AuthServiceInterface } from "./interface/auth-service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserRole } from "src/data-service/models/user";
import { DataServiceInterface } from "src/data-service/interface/data-service.interface";
import { UnauthorizedException } from '@nestjs/common';
import { getDefaultImage } from "src/utils/default-image";

@Injectable()
export class AuthServiceAdapter implements AuthServiceInterface {

  private readonly logger: Logger = new Logger(AuthServiceAdapter.name);

  constructor(
    private readonly dataService: DataServiceInterface
  ) { }


  async createUser(createUser: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUser.name}`);
    const user: User = {
      name: createUser.name,
      email: createUser.email,
      address: createUser.address,
      password: createUser.password,
      role: UserRole.User,
      image: getDefaultImage()
    }
    return await this.dataService.users.add(user);
  }

  async signIn(email: string, pass: string): Promise<User> {
    const user = await this.dataService.users.getByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
