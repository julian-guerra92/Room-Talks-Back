import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrivateChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';

@Module({
   providers: [EventsGateway],
   imports: [
      PrivateChatModule,
      MessageModule
   ],
})
export class EventsModule {}
