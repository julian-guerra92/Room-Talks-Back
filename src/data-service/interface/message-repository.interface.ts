import { Message } from 'src/data-service/models/message';
import { GenericRepositoryInterface } from "./generic-repository.interface";

export interface MessageRepositoryInterface extends GenericRepositoryInterface<Message>{
   getMessageByChatId(chatId: string): Promise<Message>;
}
