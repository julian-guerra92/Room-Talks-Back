import { UpdatePasswordDto } from "src/users/dto/update-password.dto";
import { User } from "../models/user";
import { GenericRepositoryInterface } from "./generic-repository.interface";
import { UpdateUserDto } from "src/users/dto/update-user.dto";


export interface UserRepositoryInterface extends GenericRepositoryInterface<User> {
   getByEmail(email: string): Promise<User>;
   updateByEmail(email: string, user: User): Promise<User>;
   getById(id: string): Promise<User>;
   updatePassword(id: string, entity: UpdatePasswordDto): Promise<User>;
}
