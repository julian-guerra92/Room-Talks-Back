import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PublicChatModule } from 'src/public-chat/public-chat.module';
import { PrivateChatModule } from 'src/private-chat/private-chat.module';
import { MessageModule } from 'src/message/message.module';

@Module({
   providers: [EventsGateway],
   imports: [
      PublicChatModule,
      PrivateChatModule,
      MessageModule
   ],
})
export class EventsModule {}
