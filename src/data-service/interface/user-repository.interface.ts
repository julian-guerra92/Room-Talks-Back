import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { User } from "../models/user";
import { GenericRepositoryInterface } from "./generic-repository.interface";


export interface UserRepositoryInterface extends GenericRepositoryInterface<User> {
   getByEmail(email: string): Promise<User>;
   updateByEmail(email: string, entity: CreateUserDto): Promise<User>;
   getById(id: string): Promise<User>;
}
