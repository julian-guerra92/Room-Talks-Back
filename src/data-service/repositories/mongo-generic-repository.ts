import { InternalServerErrorException, Logger } from "@nestjs/common";
import { Model } from "mongoose";

import { GenericRepositoryInterface } from "../interface/generic-repository.interface";


export class MongoGenericRespository<T> implements GenericRepositoryInterface<T> {

   logger: Logger = new Logger(MongoGenericRespository.name);
   repository: Model<T>;

   constructor(repository: Model<T>) {
      this.repository = repository;
   }

   async getAll(): Promise<T[]> {
      try {
         const documents = await this.repository.find();
         return documents;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to get all documents`, '');
         throw new InternalServerErrorException('Error to get information from database.');
      }
   }

   async getById(id: string): Promise<T> {
      try {
         const document = await this.repository.findById(id);
         return document;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to get document by ID`, '');
         throw new InternalServerErrorException('Error to get information from database.');
      }
   }

   async add(entity: T): Promise<T> {
      try {
         const document = await this.repository.create(entity);
         return document;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to add document in database`, '');
         throw new InternalServerErrorException('Error to add information from database.');
      }
   }

   async updateById(id: string, entity: T): Promise<T> {
      try {
         const document = await this.repository.findByIdAndUpdate(id, entity, { new: true });
         return document;
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to update document in databse`, '');
         throw new InternalServerErrorException('Error to update information from database.');
      }
   }

   async deleteById(id: string): Promise<void> {
      try {
         await this.repository.findByIdAndDelete(id);
      } catch (error) {
         this.logger.log(error);
         this.logger.error(`Error to get document by ID`, '');
         throw new InternalServerErrorException('Error to delete information from database.');
      }
   }

}