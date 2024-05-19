import { Module } from '@nestjs/common';
import { UsersController } from "./users.controller";
import { UsersServiceInterface } from "./interface/users-service";
import { UsersServiceAdapter } from "./users.service";
import { DataServiceModule } from "src/data-service/data-service.module";

const AuthService = {
    provide: UsersServiceInterface,
    useClass: UsersServiceAdapter
 }
 
@Module({
    controllers: [UsersController],
    providers: [AuthService],
    imports: [DataServiceModule]
 })
 export class UsersModule {}
