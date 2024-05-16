import { User } from "src/data-service/models/user";
import { UpdateUserDto } from "../dto/update-user.dto";

export abstract class UsersServiceInterface {
   abstract updateUser(entity: UpdateUserDto): Promise<User>;
   abstract getUser(email: string): Promise<User>;
}
