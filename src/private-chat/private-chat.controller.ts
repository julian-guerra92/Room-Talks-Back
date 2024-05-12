import { Controller, Post, Body, Param, Res, HttpStatus, Delete, Get, Put } from '@nestjs/common';
import { Response } from 'express';

import { User } from 'src/data-service/models/user';
import { Chat } from 'src/data-service/models/chat';
import { PrivateChatServiceInterface } from './interface/private-chat.interface';
import { PrivateChatDto } from './dto/private-chat.dto';

@Controller('private-chat')
export class PrivateChatController {
  constructor(
    private privateChatService: PrivateChatServiceInterface,
  ) { }

  @Post()
  async createPrivateChat(@Body() privateChatDto: PrivateChatDto,): Promise<Chat> {
      const chat = await this.privateChatService.createPrivateChat(privateChatDto);
      return chat;
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
