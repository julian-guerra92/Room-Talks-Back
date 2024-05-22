

export interface ChatMessageRequesrDto {
   message: string;
}

export interface ChatMessageResponseDto {
   status: string;
   message?: string;
   userId?: string;
   chatId?: string;
   userName?: string;
}