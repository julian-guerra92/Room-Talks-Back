import { Model } from "mongoose";
import { InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "src/auth/dto/create-user.dto"
import { UserRepositoryInterface } from "../interface/user-repository.interface";
import { User, UserRole } from "../models/user";
import { MongoGenericRespository } from "./mongo-generic-repository";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UpdatePasswordDto } from "src/users/dto/update-password.dto";


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

   async getById(id: string): Promise<User> {
      try {
         const document = await this.repository.findById(id);
         return document;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to get user by id`, '');
         throw new InternalServerErrorException('Error to get information from database.');
      }
   }

   async updateByEmail(email: string, entity: UpdateUserDto, image: Express.Multer.File): Promise<User> {
      try {
         return await this.repository.findOneAndUpdate({ email: email }, {$set: entity}, {new: true});
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to update user by email`, '');
         throw new InternalServerErrorException('Error to update information in database.');
      }
   }

   async updatePassword(id: string, entity: UpdatePasswordDto): Promise<User> {
      try {
         const update = { ["password"]: entity.newPassword };
         return await this.repository.findByIdAndUpdate(id, {$set: update}, {new: true});
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to update your password`, '');
         throw new InternalServerErrorException('Error to update information in database.');
      }
   }

}