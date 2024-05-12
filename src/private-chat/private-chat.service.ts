import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';
import { Chat } from 'src/data-service/models/chat';
import { User } from 'src/data-service/models/user';
import { PrivateChatServiceInterface } from './interface/private-chat.interface';
import { PrivateChatDto } from './dto/private-chat.dto';

@Injectable()
export class PrivateChatServiceAdapter implements PrivateChatServiceInterface {

  logger: Logger = new Logger('PrivateChatServiceAdapter');
  constructor(private readonly dataService: DataServiceInterface) { }

  async createPrivateChat(privateChatDto: PrivateChatDto): Promise<Chat> {
    const { senderUserId, receiverUserId } = privateChatDto;
    try {
      //TODO: Ajustar esta operación
      const senderUser = await this.dataService.users.getById(senderUserId);
      const reciverUser = await this.dataService.users.getById(receiverUserId);

      if (!senderUser || !reciverUser) {
        throw new NotFoundException('Sender or receiver user not found');
      }

      //TODO: Validar si el chat de estos usuarios ya existe
      
      const newChat: Chat = {
        name: `${senderUser.name} / ${reciverUser.name}`,
        type: 'private',
        participants: [senderUser, reciverUser],
      };

      const createdChat = await this.dataService.chats.add(newChat);
      return createdChat;
      
    } catch (error) {
      this.logger.error('Error creating private chat');
      this.logger.error(error);
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error creating private chat',
        message: error.message
      }, error.response.statusCode);
    }
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
