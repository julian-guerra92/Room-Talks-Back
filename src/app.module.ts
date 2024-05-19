import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataServiceModule } from './data-service/data-service.module';
import { AuthModule } from './auth/auth.module';
import { PrivateChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { MessageModule } from './message/message.module';
import { ImageHanlderModule } from './image-handler/image-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DataServiceModule,
    AuthModule,
    PrivateChatModule,
    UsersModule,
    MessageModule,
    EventsModule,
    ImageHanlderModule,
  ],
})
export class AppModule { }
