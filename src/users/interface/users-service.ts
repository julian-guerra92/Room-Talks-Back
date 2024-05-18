import { User } from "src/data-service/models/user";
import { UpdateUserDto } from "../dto/update-user.dto";

export abstract class UsersServiceInterface {
   abstract updateUser(entity: UpdateUserDto): Promise<User>;
   abstract getUserByEmail(email: string): Promise<User>;
   abstract getUserById(id: string): Promise<User>;
}
