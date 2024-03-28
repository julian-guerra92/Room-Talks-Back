import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { DataServiceInterface } from './interface/data-service.interface';
import { DataServiceAdpater } from "./data-service.service";
import { User, UserSchema } from "./models/user";
import { Chat, ChatSchema } from "./models/chat";
import { Message, MessageSchema } from "./models/message";


const DataService = {
   provide: DataServiceInterface,
   useClass: DataServiceAdpater
}

@Module({
   imports: [
      ConfigModule,
      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGO_URI'),
            dbName: configService.get('MONGO_DB_NAME')
         }),
         imports: [ConfigModule],
      }),
      MongooseModule.forFeature([
         { name: User.name, schema: UserSchema },
         { name: Chat.name, schema: ChatSchema },
         { name: Message.name, schema: MessageSchema }
      ]),
   ],
   providers: [
      DataService
   ],
   exports: [
      DataService
   ]
})
export class DataServiceModule { }