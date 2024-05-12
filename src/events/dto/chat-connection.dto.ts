import { ChatType } from "src/data-service/models/chat";

export class ChatConnectionRequestDto {
   chatId: string;
   type: ChatType
}

export class ChatConnectionResponseDto {
   statusConnection: string;
   userId?: string;
   chatId?: string;
}