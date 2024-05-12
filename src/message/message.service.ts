import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { Message } from 'src/data-service/models/message';
import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';
import { MessageServiceInterface } from './interface/message-service';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageServiceAdapter implements MessageServiceInterface {

  logger: Logger = new Logger('MessageService');

  constructor(
    private readonly dataService: DataServiceInterface
  ) { }

  async saveMessage(messageDto: MessageDto,): Promise<Message> {
    this.logger.log('Iniciando proceso saveMessage');
    try {
      const chat = await this.dataService.chats.getById(messageDto.IdChat);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      const createdMessage = await this.dataService.messages.add(messageDto);
      this.logger.log('Mensaje almacendo con éxito: ', createdMessage);
      return createdMessage;
    } catch (error) {
      this.logger.error('Error en saveMessage', error);
    }
  }

  async getMessagesByChat(chatId: string): Promise<MessageDto[]> {
    try {
      const chat = await this.dataService.chats.getById(chatId);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      const chatMessages = await this.dataService.messages.getMessagesByChatId(chatId);
      return chatMessages;
    } catch (error) {
      this.logger.error('Error en getMessagesByChat', error);
    }
  }

}
