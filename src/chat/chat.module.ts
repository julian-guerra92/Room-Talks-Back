import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatServiceAdapter } from './chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';
import { ChatServiceInterface } from './interface/chat.interface';

const ChatService = {
  provide: ChatServiceInterface,
  useClass: ChatServiceAdapter
}

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [DataServiceModule],
  exports: [ChatService]
})
export class PrivateChatModule { }
