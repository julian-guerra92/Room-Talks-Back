import { Model } from 'mongoose';
import { Chat } from 'src/data-service/models/chat';
import { MongoGenericRespository } from "./mongo-generic-repository";
import { ChatRepositoryInterface } from "../interface/chat-repository.interface";
import { InternalServerErrorException } from '@nestjs/common';


export class ChatRepository extends MongoGenericRespository<Chat> implements ChatRepositoryInterface {

  constructor(repository: Model<Chat>) {
    super(repository);
  }

  async getchatByName(name: string): Promise<Chat> {
    try {
      const chat = await this.repository.findOne({ name });
      return chat;
    } catch (error) {
      this.logger.log(error);
      this.logger.error(`Error al obtener chat por name.`, '');
      throw new InternalServerErrorException(
        'Error al obtener chat por name.',
      );
    }
  }

}
