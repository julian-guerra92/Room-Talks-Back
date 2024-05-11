import { Model } from 'mongoose';
import { Chat } from 'src/data-service/models/chat';
import { MongoGenericRespository } from "./mongo-generic-repository";
import { ChatRepositoryInterface } from "../interface/chat-repository.interface";


export class ChatRepository extends MongoGenericRespository<Chat> implements ChatRepositoryInterface {

  constructor(repository: Model<Chat>) {
    super(repository);
  }

}
