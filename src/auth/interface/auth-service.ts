import { User } from "src/data-service/models/user";
import { CreateUserDto } from "../dto/create-user.dto";


export abstract class AuthServiceInterface {
   abstract createUser(createUser: CreateUserDto): Promise<User>;
   abstract getUser(email: string): Promise<User>;
   abstract updateUser(entity: CreateUserDto): Promise<User>;
}