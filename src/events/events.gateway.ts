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

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server
  logger: Logger = new Logger('EventsGateway');

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

    //TODO: Ejecutar proceso para validar si el chat existe

    socket.join(body.chatId);
    socket.data.chatId = body.chatId;
    this.logger.log(`New chat connection: ${JSON.stringify(socket.data)}`);

    const response: ChatConnectionResponseDto = {
      statusConnection: 'success',
      userId: socket.data.userId,
      chatId: body.chatId
    }

    this.server.to(body.chatId).emit('chat-connection', {
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

    const response: ChatMessageResponseDto = {
      message: body.message,
      userId: socket.data.userId,
      chatId: socket.data.chatId
    }

    this.server.to(socket.data.chatId).emit('chat-message', {
      event: 'chat-message',
      data: response
    });
  }

}
