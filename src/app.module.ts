import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataServiceModule } from './data-service/data-service.module';
import { AuthModule } from './auth/auth.module';
import { PrivateChatModule } from './private-chat/private-chat.module';
import { PublicChatModule } from './public-chat/public-chat.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DataServiceModule,
    AuthModule,
    PrivateChatModule,
    PublicChatModule,
    UsersModule,
    EventsModule
  ],
})
export class AppModule { }
