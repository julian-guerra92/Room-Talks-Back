import { Model } from "mongoose";
import { InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "src/auth/dto/create-user.dto"
import { UserRepositoryInterface } from "../interface/user-repository.interface";
import { User } from "../models/user";
import { MongoGenericRespository } from "./mongo-generic-repository";


export class UserRepository extends MongoGenericRespository<User> implements UserRepositoryInterface {

   constructor(repository: Model<User>) {
      super(repository);
   }

   async getByEmail(email: string): Promise<User> {
      try {
         const document = await this.repository.findOne({ email: email });
         return document;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to get user by email`, '');
         throw new InternalServerErrorException('Error to get information from database.');
      }
   }

   async updateByEmail(email: string, entity: CreateUserDto): Promise<User> {
      try {
         const user = await this.repository.findOneAndUpdate({ email: email }, entity);
         return user;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to update user by email`, '');
         throw new InternalServerErrorException('Error to update information in database.');
      }
   }

}