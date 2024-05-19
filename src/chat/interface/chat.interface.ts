import { Chat } from "src/data-service/models/chat";
import { PrivateChatDto, PublicChatDto } from "../dto/chat.dto";

export abstract class ChatServiceInterface {
   abstract createPrivateChat(privateChatDto: PrivateChatDto): Promise<Chat>
   abstract createPublicChat(publicChatDto: PublicChatDto, mage: Express.Multer.File): Promise<Chat>
   abstract deleteChat(chatId: string, userId: string): Promise<void>
   abstract getChatById(chatId: string): Promise<Chat>
   abstract updateChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat>

}