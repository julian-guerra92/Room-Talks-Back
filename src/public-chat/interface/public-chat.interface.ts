import { Chat } from "src/data-service/models/chat";
import { User } from "src/data-service/models/user";


export abstract class PublicChatServiceInterface {
   abstract createPublicChat(name: string, participants: User[]): Promise<Chat>;
   abstract getPublicChatById(chatId: string): Promise<Chat>;
   abstract deletePublicChat(chatId: string): Promise<void> ;
   abstract updatePublicChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat>;
}