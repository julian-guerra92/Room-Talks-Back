import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrivateChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';
import { UsersModule } from 'src/users/users.module';

@Module({
   providers: [EventsGateway],
   imports: [
      PrivateChatModule,
      MessageModule,
      UsersModule
   ],
})
export class EventsModule {}
