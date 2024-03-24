import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicChatController } from './controllers/public-chat.controller';
import { PublicChatService } from './services/public-chat.service';
import { PublicChatRoom, PublicChatRoomSchema } from './models/public-chat-room';
import { MessageControllerController } from './controllers/message-controller/message-controller.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PublicChatRoom.name, schema: PublicChatRoomSchema }]),
  ],
  controllers: [PublicChatController, MessageControllerController],
  providers: [PublicChatService],
})
export class PublicChatModule {}