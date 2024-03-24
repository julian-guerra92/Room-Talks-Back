/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Inject, Res, HttpStatus, Delete, Get, Put} from '@nestjs/common';
import { PrivateChatService } from '../services/private-chat.service';
import { User } from 'src/data-service/models/user';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { Chat } from 'src/data-service/models/chat';

@Controller('private-chat')
export class PrivateChatController {
  constructor(
    private privateChatService: PrivateChatService,
    @Inject('CHAT_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @Post()
  async createPrivateChat(
    @Body() participants: User[],
    @Res() res: Response,
  ): Promise<void> {
    try {
      const chat = await this.privateChatService.createPrivateChat(
        participants[0],
        participants[1],
      );
      res.status(HttpStatus.CREATED).json(chat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Delete(':chatId/:userId')
  async deletePrivateChat(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const deletedChat = await this.privateChatService.deleteConversation(chatId, userId);
      res.status(HttpStatus.OK).json(deletedChat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get(':chatId')
  async getPrivateChat(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const chat = await this.privateChatService.getPrivateChatById(chatId);
      if (!chat) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Chat not found' });
      } else {
        res.status(HttpStatus.OK).json(chat);
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Put(':chatId')
  async updatePrivateChat(
    @Param('chatId') chatId: string,
    @Body() updatedData: Partial<Chat>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const updatedChat = await this.privateChatService.updatePrivateChat(chatId, updatedData);
      res.status(HttpStatus.OK).json(updatedChat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
