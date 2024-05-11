/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Res, NotFoundException} from '@nestjs/common';
import { MessageService } from './message.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Response } from 'express';

@WebSocketGateway()
@Controller('message')
export class MessageController {
  @WebSocketServer() server: Server;

  constructor(private messageService: MessageService) {}

  @Post()
  async createMessage (@Body() messageData: { content: string, senderId: string }, @Res() res: Response): Promise<void> {
    try {
      const message = await this.messageService.createMessage(messageData.content, messageData.senderId);
      this.server.emit('newMessage', message);
      res.statusCode = HttpStatus.CREATED;
      res.json(message);
    } catch (error) {
      res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      res.json({ error: error.message });
    }
  }

  @Get(':chatId') async getMessagesByChat(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      //const messages = await this.messageService.getMessagesByChat(chatId);
      //res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Delete(':messageId') async deleteMessage( @Param('messageId') messageId: string, @Res() res: Response ): Promise<void> {
    try {
      await this.messageService.deleteMessage(messageId);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Message deleted successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get(':id')
  async getMessageById(@Param('id') messageId: string, @Res() res: Response): Promise<void> {
    try {
      const message = await this.messageService.getMessageById(messageId);
      if (!message) {
        throw new NotFoundException('Message not found.');
      }
      res.status(HttpStatus.OK).json(message);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}
