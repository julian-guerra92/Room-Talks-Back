import { Controller, Post, Body, Param, Res, HttpStatus, Delete, Get, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';

import { Chat } from 'src/data-service/models/chat';
import { ChatServiceInterface } from './interface/chat.interface';
import { PrivateChatDto, PublicChatDto } from './dto/chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatServiceInterface,
  ) { }

  @Post('/private')
  async createPrivateChat(@Body() privateChatDto: PrivateChatDto,): Promise<Chat> {
    const chat = await this.chatService.createPrivateChat(privateChatDto);
    return chat;
  }

  @Post('/public')
  @UseInterceptors(FileInterceptor('file'))
  async createPublicChat(
    @Body() publicChatDto: PublicChatDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Chat> {
    const chat = await this.chatService.createPublicChat(publicChatDto, image);
    return chat;
  }

  @Delete(':chatId/:userId')
  async deletePrivateChat(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const deletedChat = await this.chatService.deleteChat(chatId, userId);
      res.status(HttpStatus.OK).json(deletedChat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get('/public')
  async getAllPublicChats(): Promise<Chat[]> {
    const chats = await this.chatService.getAllPublicChats();
    return chats;
  }

  @Get(':chatId')
  async getPrivateChat(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const chat = await this.chatService.getChatById(chatId);
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
  @UseInterceptors(FileInterceptor('file'))
  async updatePrivateChat(
    @Param('chatId') chatId: string,
    @Body() updatedData: Partial<Chat>,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const updatedChat = await this.chatService.updateChat(chatId, updatedData, image);
      res.status(HttpStatus.OK).json(updatedChat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
