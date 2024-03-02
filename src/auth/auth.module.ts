import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServiceInterface } from "./interface/auth-service";
import { AuthServiceAdapter } from "./auth.service";
import { DataServiceModule } from "src/data-service/data-service.module";


const AuthService = {
   provide: AuthServiceInterface,
   useClass: AuthServiceAdapter
}


@Module({
   controllers: [AuthController],
   providers: [AuthService],
   imports: [DataServiceModule]
})
export class AuthModule {}