import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DataServiceInterface } from "./interface/data-service";
import { UserRepository } from "./repositories/user-repository";
import { User } from "./models/user";
import { Chat } from "./models/chat";
import { Message } from "./models/message";
import { ChatRepository } from "./repositories/chat.repository";
import { MessageRepository } from "./repositories/message.repository";

@Injectable()
export class DataServiceAdpater implements DataServiceInterface, OnApplicationBootstrap {

   user: UserRepository;
   chat: ChatRepository;
   message: MessageRepository;

   constructor(
      @InjectModel('User')
      private readonly UserRepository: Model<User>,

      @InjectModel('Chat')
      private readonly ChatRepository: Model<Chat>,

      @InjectModel('Message')
      private readonly MessageRepository: Model<Message>,
   ) { }

   onApplicationBootstrap() {
      this.user = new UserRepository(this.UserRepository);
      this.chat = new this.ChatRepository(this.ChatRepository);
      this.message = new this.MessageRepository(this.MessageRepository);
   }
}