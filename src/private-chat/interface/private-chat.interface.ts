import { Chat } from "src/data-service/models/chat";
import { PrivateChatDto } from "../dto/private-chat.dto";

export abstract class PrivateChatServiceInterface {
   abstract createPrivateChat(privateChatDto: PrivateChatDto): Promise<Chat>
   abstract deleteConversation(chatId: string, userId: string): Promise<void>
   abstract getPrivateChatById(chatId: string): Promise<Chat>
   abstract updatePrivateChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat>

}