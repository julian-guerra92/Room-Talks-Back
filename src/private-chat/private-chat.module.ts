import { Module } from '@nestjs/common';

import { PrivateChatController } from './private-chat.controller';
import { PrivateChatService } from './private-chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';

@Module({
  controllers: [PrivateChatController],
  providers: [PrivateChatService],
  imports: [DataServiceModule]
})
export class PrivateChatModule {}
