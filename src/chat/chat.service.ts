import { BadRequestException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DataServiceInterface } from 'src/data-service/interface/data-service.interface';
import { Chat } from 'src/data-service/models/chat';
import { User } from 'src/data-service/models/user';
import { ChatServiceInterface } from './interface/chat.interface';
import { PrivateChatDto, PublicChatDto } from './dto/chat.dto';
import { ImageHandlerInterface } from 'src/image-handler/interface/image-hanlder';

@Injectable()
export class ChatServiceAdapter implements ChatServiceInterface {

  logger: Logger = new Logger(ChatServiceAdapter.name);
  constructor(
    private readonly dataService: DataServiceInterface,
    private readonly imageHandlerService: ImageHandlerInterface,
  ) { }

  async getChatById(chatId: string): Promise<Chat> {
    let chat: Chat = null;
    try {
      chat = await this.dataService.chats.getById(chatId);
      this.logger.log('Chat obtenido correctamente.')
    } catch (error) {
      this.logger.error('Error getting chat by id');
      this.logger.error(error);
    }
    return chat;
  }

  async createPrivateChat(privateChatDto: PrivateChatDto): Promise<Chat> {
    const { senderUserId, receiverUserId } = privateChatDto;
    try {
      //TODO: Ajustar esta operación
      const senderUser = await this.dataService.users.getById(senderUserId);
      const reciverUser = await this.dataService.users.getById(receiverUserId);

      if (!senderUser || !reciverUser) {
        throw new NotFoundException('Sender or receiver user not found');
      }

      const chatName = `${senderUser.name} / ${reciverUser.name}`;
      let chat = await this.dataService.chats.getchatByName(chatName);

      if (!chat) {
        const newChat: Chat = {
          name: chatName,
          type: 'private',
          participants: [senderUser, reciverUser],
        };
        chat = await this.dataService.chats.add(newChat);
      }
      return chat;

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

  async createPublicChat(publicChatDto: PublicChatDto, image: Express.Multer.File): Promise<Chat> {
    this.logger.log('Creating public chat');
    const { name, description } = publicChatDto;
    if (!image) {
      throw new BadRequestException('Image is required');
    }
    try {
      const chat = await this.dataService.chats.getchatByName(name);
      if (chat) {
        throw new BadRequestException(`Chat with name ${name} already exists`);
      }

      const imageHanlderResponse = await this.imageHandlerService.uploadImage(image);
      if (imageHanlderResponse.error) {
        throw new Error(imageHanlderResponse.error);
      }
      this.logger.log('Image uploaded successfully');
      this.logger.log(JSON.stringify(imageHanlderResponse, null, 2));
      const referenceImage = imageHanlderResponse.url;

      const chatData: Chat = {
        name,
        description,
        referenceImage,
        type: 'public',
        participants: [],
      };
      const newChat = await this.dataService.chats.add(chatData);
      return newChat;
      
    } catch (error) {

      this.logger.error('Error creating public chat');
      this.logger.error(error);
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error creating public chat',
        message: error.message
      }, error.response.statusCode);

    }
  }

  async deleteChat(chatId: string, userId: string): Promise<void> {
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



  async updateChat(chatId: string, updatedData: Partial<Chat>): Promise<Chat> {
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
