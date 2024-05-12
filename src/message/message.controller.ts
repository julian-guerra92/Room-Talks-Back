import { Controller, Get } from "@nestjs/common";
import { MessageServiceInterface } from "./interface/message-service";



@Controller('message')
export class MessageController {

   constructor(private messageService: MessageServiceInterface) { }

   @Get('get-messages/:chatId')
   getMessagesByChat(chatId: string) {
      const messages = this.messageService.getMessagesByChat(chatId);
      return messages;
   }

}