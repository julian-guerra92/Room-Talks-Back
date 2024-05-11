import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

import { Message } from 'src/data-service/models/message';
import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';

@Injectable()
export class MessageService {
  constructor(
    private readonly dataService: DataServiceInterface
  ) { }

  async createMessage(content: string, senderId: string): Promise<Message> {
    const message: Message = new Message();
    message.id = 'generatedId';
    message.content = content;
    message.senderId = senderId;
    message.timestamp = new Date();

    try {
      const createdMessage = await this.dataService.messages.add(message);
      return createdMessage;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el mensaje.');
    }
  }

  // async getMessagesByChat(chatId: string): Promise<Message[]> {
  //   const chatMessages = await this.dataService.messages.getMessageByChatId(chatId);
  //   //return chatMessages.filter((message) => message.content.includes(chatId));
  // }

  async deleteMessage(messageId: string): Promise<void> {
    const messageToDelete = this.dataService.messages.getById(messageId);
    if (!messageToDelete) {
      throw new NotFoundException('Message not found');
    }
    this.dataService.messages.deleteById(messageId);
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.dataService.messages.getById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found.');
    }
    return message;
  }
}
