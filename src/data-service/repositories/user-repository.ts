import { Model } from "mongoose";

import { UserRepositoryInterface } from "../interface/user-repository";
import { User } from "../models/user";
import { MongoGenericRespository } from "./mongo-generic-repository";
import { InternalServerErrorException } from "@nestjs/common";


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

}