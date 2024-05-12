/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';

import { Chat } from 'src/data-service/models/chat';
import { User } from 'src/data-service/models/user';
import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';
import { PublicChatServiceInterface } from './interface/public-chat.interface';

@Injectable()
export class PublicChatServiceAdapter implements PublicChatServiceInterface {
  constructor( private readonly dataService: DataServiceInterface) {}

  async createPublicChat(name: string, participants: User[]): Promise<Chat> {
    const chatData: Chat = new Chat();
    chatData.name = name;
    chatData.type = 'public';
    chatData.participants = participants;

    const createdChat = await this.dataService.chats.add(chatData);
    return createdChat;
  }

  async getPublicChatById(chatId: string): Promise<Chat> {
    const chat = await this.dataService.chats.getById(chatId);
    return chat;
  }

  async deletePublicChat(chatId: string): Promise<void> {
    await this.dataService.chats.deleteById(chatId);
  }

  async updatePublicChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat> {
    const chat = await this.dataService.chats.getById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    Object.assign(chat, updatedData); // Actualizar todas las propiedades del chat con los datos actualizados
    const updatedChat = await this.dataService.chats.updateById(chatId, chat);
    return updatedChat;
  }
  
}