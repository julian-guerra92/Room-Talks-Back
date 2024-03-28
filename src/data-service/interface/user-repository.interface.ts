import { User } from "../models/user";
import { GenericRepositoryInterface } from "./generic-repository.interface";


export interface UserRepositoryInterface extends GenericRepositoryInterface<User> {
   getByEmail(email: string): Promise<User>;
}
