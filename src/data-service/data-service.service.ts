import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DataServiceInterface } from "./interface/data-service";
import { UserRepository } from "./repositories/user-repository";
import { User } from "./models/user";

@Injectable()
export class DataServiceAdpater implements DataServiceInterface, OnApplicationBootstrap {

   user: UserRepository;

   constructor(
      @InjectModel('User')
      private readonly UserRepository: Model<User>
   ) { }

   onApplicationBootstrap() {
      this.user = new UserRepository(this.UserRepository);
   }

}