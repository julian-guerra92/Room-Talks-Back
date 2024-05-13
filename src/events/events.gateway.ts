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
import { ChatServiceInterface } from 'src/chat/interface/chat.interface';
import { Chat } from 'src/data-service/models/chat';
import { MessageServiceInterface } from 'src/message/interface/message-service';
import { MessageDto } from 'src/message/dto/message.dto';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server
  logger: Logger = new Logger('EventsGateway');

  constructor(
    private privateChatService: ChatServiceInterface,
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
    //TODO: Validar si el usuario existe en DB
    client.data = query;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${JSON.stringify(client.data)}`);
  }

  @SubscribeMessage('chat-connection')
  async handleEventChatConnection(@MessageBody() body: ChatConnectionRequestDto, @ConnectedSocket() socket: Socket): Promise<void> {
    let chat: Chat;
    let response: ChatConnectionResponseDto = { statusConnection: 'fail' };
    chat = await this.privateChatService.getChatById(body.chatId);
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
    this.server.to(socket.id).emit('chat-connection', {
      event: 'chat-connection',
      data: response
    });
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
  }

  //TODO: Ajustar para emitir evento de nuevo mensaje tanto en char privados como públicos
  @SubscribeMessage('new-message')
  async handleNewMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket): Promise<void> {
    this.server.to(socket.data.chatId).emit('new-message', {
      event: 'new-message',
      data: body
    });
  }
}
