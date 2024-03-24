import { Module } from '@nestjs/common';
import { PrivatechatController } from './privatechat/privatechat.controller';
import { PrivateChatController } from './private-chat.controller';
import { MessageControllerController } from './controllers/message-controller/message-controller.controller';
import { PrivateChatService } from './private-chat.service';
import { PrivateChatController } from './private-chat.controller';
import { PrivateChatController } from './private-chat.controller';

@Module({
  controllers: [PrivatechatController, PrivateChatController, MessageControllerController],
  providers: [PrivateChatService]
})
export class PrivateChatModule {}
