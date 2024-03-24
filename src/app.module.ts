import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataServiceModule } from './data-service/data-service.module';
import { AuthModule } from './auth/auth.module';
import { PrivateChatModule } from './private-chat/private-chat.module';
import { PublicChatModule } from './public-chat/public-chat.module';
import { UsersModule } from './users/users.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { PrivateChatService } from './pirvate-chat/pirvate-chat.service';

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
  controllers: [
  AppController,
  PrivateChatController,
  PublicChatController
  ],
  providers: [
  AppService,
  EventsGateway,
  PrivateChatService,
  PublicChatService
  ],
})
export class AppModule { }
