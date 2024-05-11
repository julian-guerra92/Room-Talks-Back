import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { DataServiceInterface } from "./interface/data-service.interface";
import { UserRepository } from "./repositories/user.repository";
import { User } from "./models/user";
import { Chat } from "./models/chat";
import { Message } from "./models/message";
import { ChatRepository } from "./repositories/chat.repository";
import { MessageRepository } from "./repositories/message.repository";

@Injectable()
export class DataServiceAdpater implements DataServiceInterface, OnApplicationBootstrap {

   users: UserRepository;
   chats: ChatRepository;
   messages: MessageRepository;

   constructor(
      @InjectModel('User')
      private readonly UserRepository: Model<User>,

      @InjectModel('Chat')
      private readonly ChatRepository: Model<Chat>,

      @InjectModel('Message')
      private readonly MessageRepository: Model<Message>,
   ) { }

   onApplicationBootstrap() {
      this.users = new UserRepository(this.UserRepository);
      this.chats = new ChatRepository(this.ChatRepository);
      this.messages = new MessageRepository(this.MessageRepository);
   }
}