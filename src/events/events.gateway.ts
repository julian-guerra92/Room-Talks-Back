import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected with id ${socket.id}`);
    })
  }

  @SubscribeMessage('chat-connection')
  handleEvent(@MessageBody() body: any, @ConnectedSocket() socket: Socket): void {
    socket.join(body.roomId);
    this.server.to(body.roomId).emit('chat-connection', {
      event: 'chat-connection',
      data: body
    });
  }

  @SubscribeMessage('chat-message')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket): void {
    this.server.to(body.roomId).emit('chat-message', {
      event: 'chat-message',
      data: body
    });
  }

}
