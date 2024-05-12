import { Message } from 'src/data-service/models/message';
import { GenericRepositoryInterface } from "./generic-repository.interface";

export interface MessageRepositoryInterface extends GenericRepositoryInterface<Message>{
   getMessagesByChatId(chatId: string): Promise<Message[]>;
}
