import { ChatRepositoryInterface } from "./chat-repository.interface";
import { MessageRepositoryInterface } from "./message-repository.interface";
import { UserRepositoryInterface } from "./user-repository.interface";


export abstract class DataServiceInterface {
   abstract users: UserRepositoryInterface;
   abstract chats: ChatRepositoryInterface;
   abstract messages: MessageRepositoryInterface;
}