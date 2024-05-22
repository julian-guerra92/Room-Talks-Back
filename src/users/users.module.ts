import { Module } from '@nestjs/common';
import { UsersController } from "./users.controller";
import { UsersServiceInterface } from "./interface/users-service";
import { UsersServiceAdapter } from "./users.service";
import { DataServiceModule } from "src/data-service/data-service.module";
import { ImageHanlderModule } from 'src/image-handler/image-handler.module';

const UsersService = {
    provide: UsersServiceInterface,
    useClass: UsersServiceAdapter
}

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        DataServiceModule,
        ImageHanlderModule
    ],
    exports: [UsersService]
})
export class UsersModule { }
