import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatServiceAdapter } from './chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';
import { ChatServiceInterface } from './interface/chat.interface';
import { ImageHanlderModule } from 'src/image-handler/image-handler.module';

const ChatService = {
  provide: ChatServiceInterface,
  useClass: ChatServiceAdapter
}

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    DataServiceModule,
    ImageHanlderModule
  ],
  exports: [ChatService]
})
export class PrivateChatModule { }
