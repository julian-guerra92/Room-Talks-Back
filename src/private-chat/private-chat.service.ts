import { Injectable, NotFoundException } from '@nestjs/common';
import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';
import { Chat } from 'src/data-service/models/chat';
import { User } from 'src/data-service/models/user';

@Injectable()
export class PrivateChatService {
  constructor(private readonly dataService: DataServiceInterface) { }

  async createPrivateChat(currentUser: User, otherUser: User): Promise<Chat> {
    const chatData: Chat = new Chat();
    chatData.name = otherUser.name; // Establecer el nombre como el nombre del otro usuario
    chatData.type = 'private';
    chatData.participants = [currentUser, otherUser];

    const createdChat = await this.dataService.chats.add(chatData);
    return createdChat;
  }

  async deleteConversation(chatId: string, userId: string): Promise<void> {
    const chat = await this.dataService.chats.getById(chatId);

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = chat.participants.some(
      (participant) => participant.email === userId,
    );

    if (!isParticipant) {
      throw new NotFoundException('User is not a participant of the chat.');
    }

    await this.dataService.chats.deleteById(chatId);
  }

  async getPrivateChatById(chatId: string): Promise<Chat> {
    const chat = await this.dataService.chats.getById(chatId);
    return chat;
  }

  async updatePrivateChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat> {
    const chat = await this.dataService.chats.getById(chatId);

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Actualizar los datos del chat con los datos actualizados
    Object.assign(chat, updatedData);

    // Guardar el chat actualizado
    const updatedChat = await this.dataService.chats.updateById(chatId, chat);
    return updatedChat;
  }
}
