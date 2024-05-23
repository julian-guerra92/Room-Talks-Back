import { Chat } from '../models/chat';
import { GenericRepositoryInterface } from "./generic-repository.interface";

export interface ChatRepositoryInterface extends GenericRepositoryInterface<Chat>{
   getchatByName(name: string): Promise<Chat>;
   getChatByIdParticipants(participantsId: string[]): Promise<Chat>;
}
