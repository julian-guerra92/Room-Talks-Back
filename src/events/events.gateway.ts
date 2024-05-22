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
import { UsersServiceInterface } from 'src/users/interface/users-service';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server
  logger: Logger = new Logger('EventsGateway');

  constructor(
    private chatService: ChatServiceInterface,
    private messsageService: MessageServiceInterface,
    private userService: UsersServiceInterface
  ) { }

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      this.logger.log(`Client connected: ${client.id}`);
    })
  }

  async handleConnection(client: Socket) {
    const id = client.handshake.query.userId as string;
    const user = await this.userService.getUserById(id);
    if(!user) {
      client.disconnect();
    }
    const query: QueryConecctionDto = {
      userId: client.handshake.query.userId as string,
      userName: user.name,
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
    chat = await this.chatService.getChatById(body.chatId);
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
    const result = await this.messsageService.saveMessage(newMessage);
    if (result) {
      response = {
        status: 'success',
        message: body.message,
        userId: socket.data.userId,
        userName: socket.data.userName,
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
