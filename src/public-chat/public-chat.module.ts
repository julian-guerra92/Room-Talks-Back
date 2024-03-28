import { Module } from '@nestjs/common';
import { PublicChatController } from './public-chat.controller';
import { PublicChatService } from './public-chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';

@Module({
  controllers: [PublicChatController],
  providers: [PublicChatService],
  imports: [DataServiceModule]
})
export class PublicChatModule {}