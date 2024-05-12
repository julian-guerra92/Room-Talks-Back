import { Message } from "src/data-service/models/message";
import { MessageDto } from "../dto/message.dto";


export abstract class MessageServiceInterface {
   abstract saveMessage(message: MessageDto): Promise<Message>;
   abstract getMessagesByChat(chatId: string): Promise<Message[]>;
}