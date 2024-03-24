/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Res, Put } from '@nestjs/common';
import { PublicChatService } from 'src/public-chat/services/public-chat-service/public-chat.service';
import { User} from 'src/data-service/models//user';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Chat } from 'src/data-service/models/chat';

@Controller('public-chat')
export class PublicChatController {
  constructor(
    private publicChatService: PublicChatService,
    @Inject('CHAT_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @Post()
  async createPublicChat(
    @Body() { name, participants }: { name: string; participants: User[] },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const chat = await this.publicChatService.createPublicChat(
        name,
        participants,
      );
      res.status(HttpStatus.CREATED).json(chat);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get(':chatId')
  async getPublicChatById(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const chat = await this.publicChatService.getPublicChatById(chatId);
      if (!chat) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Chat not found' });
      } else {
        res.status(HttpStatus.OK).json(chat);
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Delete(':chatId')
  async deletePublicChat(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.publicChatService.deletePublicChat(chatId);
      res.status(HttpStatus.OK).json({ message: 'Chat deleted successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Put(':chatId')
  async updatePublicChat(
    @Param('chatId') chatId: string,
    @Body() updatedData: Partial<Chat>,
    @Res() res: Response,
    ): Promise<void> {
      try {
        const chat = await this.publicChatService.updatePublicChat(
          chatId,
          updatedData,
        );
        res.status(HttpStatus.OK).json(chat);
      } catch (error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
}
