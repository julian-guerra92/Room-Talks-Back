import { Module } from '@nestjs/common';
import { PublicChatController } from './public-chat.controller';
import { PublicChatServiceAdapter } from './public-chat.service';
import { DataServiceModule } from 'src/data-service/data-service.module';
import { PublicChatServiceInterface } from './interface/public-chat.interface';

const PublicChatService = {
  provide: PublicChatServiceInterface,
  useClass: PublicChatServiceAdapter
}

@Module({
  controllers: [PublicChatController],
  providers: [PublicChatService],
  imports: [DataServiceModule],
  exports: [PublicChatService]
})
export class PublicChatModule { }