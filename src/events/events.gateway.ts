import { Logger, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

import { ChatConnectionRequestDto, ChatConnectionResponseDto } from './dto/chat-connection.dto';
import { QueryConecctionDto } from './dto/ws-connection.dto';
import { ChatMessageRequesrDto, ChatMessageResponseDto } from './dto/chat-message.dto';
import { PublicChatServiceInterface } from 'src/public-chat/interface/public-chat.interface';
import { PrivateChatServiceInterface } from 'src/private-chat/interface/private-chat.interface';
import { Chat } from 'src/data-service/models/chat';
import { MessageServiceInterface } from 'src/message/interface/message-service';
import { MessageDto } from 'src/message/dto/message.dto';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server
  logger: Logger = new Logger('EventsGateway');

  constructor(
    private publicChatService: PublicChatServiceInterface,
    private privateChatService: PrivateChatServiceInterface,
    private privateMesssageService: MessageServiceInterface
  ) { }

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      this.logger.log(`Client connected: ${client.id}`);
    })
  }

  handleConnection(client: Socket) {
    const query: QueryConecctionDto = {
      userId: client.handshake.query.userId as string
    }
    client.data = query;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${JSON.stringify(client.data)}`);
  }

  @SubscribeMessage('chat-connection')
  async handleEventChatConnection(@MessageBody() body: ChatConnectionRequestDto, @ConnectedSocket() socket: Socket): Promise<void> {
    let chat: Chat;
    let response: ChatConnectionResponseDto = { statusConnection: 'fail' };
    try {
      if (body.type === 'private') {
        chat = await this.privateChatService.getPrivateChatById(body.chatId);
      }
      if (body.type === 'public') {
        chat = await this.publicChatService.getPublicChatById(body.chatId);
      }

      if (chat) {
        response = {
          statusConnection: 'success',
          userId: socket.data.userId,
          chatId: body.chatId
        }
        socket.join(body.chatId);
        socket.data.chatId = body.chatId;
        this.logger.log(`New chat connection: ${JSON.stringify(socket.data)}`);
      }

      this.server.to(body.chatId).emit('chat-connection', {
        event: 'chat-connection',
        data: response
      });
    } catch (error) {
      this.logger.error(`Error al procesar evento chat-connection`);
    }
  }

  @SubscribeMessage('chat-disconnection')
  async handleDisconnection(@MessageBody() body: any, @ConnectedSocket() socket: Socket): Promise<void> {
    socket.leave(socket.data.chatId);
    socket.data.chatId = null;
  }

  @SubscribeMessage('chat-message')
  async handleEventChatMessage(@MessageBody() body: ChatMessageRequesrDto, @ConnectedSocket() socket: Socket): Promise<void> {
    const newMessage: MessageDto = {
      content: body.message,
      IdChat: socket.data.chatId,
      senderId: socket.data.userId,
      timestamp: new Date()
    }
    let response: ChatMessageResponseDto = { status: 'fail' };
    try {
      const result = await this.privateMesssageService.saveMessage(newMessage);
      if (result) {
        response = {
          status: 'success',
          message: body.message,
          userId: socket.data.userId,
          chatId: socket.data.chatId
        }
      }
      this.server.to(socket.data.chatId).emit('chat-message', {
        event: 'chat-message',
        data: response
      });
    } catch (error) {
      this.logger.error(`Error al procesar evento chat-message`);
      this.logger.error(error);
    }
  }
}
