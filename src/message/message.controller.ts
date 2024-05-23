import { Controller, Get, Param } from "@nestjs/common";
import { MessageServiceInterface } from "./interface/message-service";



@Controller('message')
export class MessageController {

   constructor(private messageService: MessageServiceInterface) { }

   @Get('get-messages/:chatId')
   getMessagesByChat(@Param('chatId') chatId: string) {
      const messages = this.messageService.getMessagesByChat(chatId);
      return messages;
   }

}