/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from 'src/data-service/models/chat';
import { ChatRepository } from 'src/data-service/repositories/chat.repository';
import { User } from 'src/data-service/models/user';

@Injectable()
export class PublicChatService {
  constructor( private readonly chatRepository: ChatRepository) {}

  async createPublicChat(name: string, participants: User[]): Promise<Chat> {
    const chatData: Chat = new Chat();
    chatData.name = name;
    chatData.type = 'public';
    chatData.participants = participants;

    const createdChat = await this.chatRepository.add(chatData);
    return createdChat;
  }

  async getPublicChatById(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);
    return chat;
  }

  async deletePublicChat(chatId: string): Promise<void> {
    await this.chatRepository.deleteById(chatId);
  }

  async updatePublicChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    Object.assign(chat, updatedData); // Actualizar todas las propiedades del chat con los datos actualizados
    const updatedChat = await this.chatRepository.updateById(chatId, chat);
    return updatedChat;
  }
  
}