/* eslint-disable prettier/prettier */
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
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error getting chat by id',
        message: error.message
      }, error.response.statusCode);
    }
    return chat;
  }

  async getAllPrivateChats(): Promise<Chat[]> {
    this.logger.log('Getting all private chats');
    let privateChats: Chat[] = [];
    try {
      privateChats = (await this.dataService.chats.getAll()).filter(chat => chat.type === 'private');
      this.logger.log('Private chats obtained successfully.');
    } catch (error) {
      this.logger.error('Error getting all private chats');
      this.logger.error(error);
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error getting all chats',
        message: error.message
      }, error.response.statusCode);
    }
    return privateChats;
  }

  async getAllPublicChats(): Promise<Chat[]> {
    this.logger.log('Getting all public chats');
    let publicChats: Chat[] = [];
    try {
      publicChats = (await this.dataService.chats.getAll()).filter(chat => chat.type === 'public');
      this.logger.log('Chats obtenidos correctamente.')
    } catch (error) {
      this.logger.error('Error getting all chats');
      this.logger.error(error);
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error getting all chats',
        message: error.message
      }, error.response.statusCode);
    }
    return publicChats;
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

      const referenceImage = await this.uploadImage(image);
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

  async updateChat(chatId: string, updatedData: Partial<Chat>, image: Express.Multer.File): Promise<Chat> {
    this.logger.log('Updating chat');
    try {
      const chat = await this.dataService.chats.getById(chatId);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      if (image) {
        await this.imageHandlerService.deleteImage(chat.referenceImage);
        updatedData.referenceImage = await this.uploadImage(image);
      }
      Object.assign(chat, updatedData);
      const updatedChat = await this.dataService.chats.updateById(chatId, chat);
      return updatedChat;

    } catch (error) {
      this.logger.error('Error updating chat');
      this.logger.error(error);
      throw new HttpException({
        statusCode: error.response.statusCode,
        error: 'Error updating chat',
        message: error.message
      }, error.response.statusCode);
    }
  }

  private async uploadImage(image: Express.Multer.File): Promise<string> {
    this.logger.log('Uploading image');
    const imageHandlerResponse = await this.imageHandlerService.uploadImage(image);
    if (imageHandlerResponse.error) {
      throw new Error(imageHandlerResponse.error);
    }
    this.logger.log('Image uploaded successfully');
    this.logger.log(JSON.stringify(imageHandlerResponse, null, 2));
    return imageHandlerResponse.url;
  }

}
