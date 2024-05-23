import { User } from "src/data-service/models/user";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdatePasswordDto } from "../dto/update-password.dto";

export abstract class UsersServiceInterface {
   abstract updateUser(entity: UpdateUserDto, image: Express.Multer.File): Promise<User>;
   abstract updatePassword(entity: UpdatePasswordDto): Promise<User>;
   abstract getUserByEmail(email: string): Promise<User>;
   abstract getUserById(id: string): Promise<User>;
   abstract getAllUsers(): Promise<User[]>;
}
