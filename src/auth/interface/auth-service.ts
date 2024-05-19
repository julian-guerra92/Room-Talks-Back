import { User } from "src/data-service/models/user";
import { CreateUserDto } from "../dto/create-user.dto";


export abstract class AuthServiceInterface {
   abstract createUser(createUser: CreateUserDto): Promise<User>;
   abstract signIn(email: string, pass: string): Promise<User>;
}