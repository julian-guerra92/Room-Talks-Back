import { InternalServerErrorException } from '@nestjs/common';
import { Message } from 'src/data-service/models/message';
import { Model } from 'mongoose';
import { MongoGenericRespository } from './mongo-generic-repository';
import { MessageRepositoryInterface } from '../interface/message-repository.interface';

export class MessageRepository extends MongoGenericRespository<Message> implements MessageRepositoryInterface {

  constructor(repository: Model<Message>) {
    super(repository);
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    try {
      const messages = await this.repository.find({ IdChat: chatId }).sort({ timestamp: 1 });
      return messages;
    } catch (error) {
      this.logger.log(error);
      this.logger.error(`Error al obtener mensajes por chat`, '');
      throw new InternalServerErrorException(
        'Error al obtener mensajes por chat.',
      );
    }
  }

}
