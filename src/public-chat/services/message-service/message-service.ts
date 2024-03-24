/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from 'src/data-service/models/message';
import { MessageRepository } from 'src/data-service/repositories/message.repository';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor( private readonly messageRepository: MessageRepository ) {}

  async createMessage(content: string, senderId: string): Promise<Message>{
    const message: Message = new Message();
    message.id = 'generatedId';
    message.content = content;
    message.senderId = senderId;
    message.timestamp = new Date();
    
    try {
        const createdMessage = await this.messageRepository.createMessage(message);
        return createdMessage;
      } catch (error) {
        throw new InternalServerErrorException('Error al crear el mensaje.');
    }
  }

  async getMessagesByChat(chatId: string): Promise<Message[]> {
    const chatMessages = await this.messageRepository.getMessageByChat(chatId);
    return chatMessages.filter((message) => message.content.includes(chatId));
  }

  async deleteMessage(messageId: string): Promise<void> {
    const messageToDelete = this.messageRepository.getMessageById(messageId);
    if (!messageToDelete) {
      throw new NotFoundException('Message not found');
    }
    this.messageRepository.deleteMessageById(messageId);
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.messageRepository.getMessageById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found.');
    }
    return message;
  }
}
