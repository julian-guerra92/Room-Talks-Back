import { Module } from "@nestjs/common";
import { MessageServiceAdapter } from './message.service';
import { MessageServiceInterface } from './interface/message-service';
import { MessageController } from "./message.controller";
import { DataServiceModule } from "src/data-service/data-service.module";

const MessageService = {
   provide: MessageServiceInterface,
   useClass: MessageServiceAdapter
}

@Module({
   controllers: [ MessageController],
   providers: [MessageService],
   imports: [DataServiceModule],
   exports: [MessageService]
})
export class MessageModule { }