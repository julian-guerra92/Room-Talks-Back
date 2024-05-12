import { Module } from '@nestjs/common';

import { PrivateChatController } from './private-chat.controller';
import { PrivateChatServiceAdapter } from './private-chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';
import { PrivateChatServiceInterface } from './interface/private-chat.interface';

const PrivateChatService = {
  provide: PrivateChatServiceInterface,
  useClass: PrivateChatServiceAdapter
}

@Module({
  controllers: [PrivateChatController],
  providers: [PrivateChatService],
  imports: [DataServiceModule],
  exports: [PrivateChatService]
})
export class PrivateChatModule { }
