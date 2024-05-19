import { HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersServiceInterface } from "./interface/users-service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "src/data-service/models/user";
import { DataServiceInterface } from "src/data-service/interface/data-service.interface";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { ImageHandlerInterface } from "src/image-handler/interface/image-hanlder";
import { getDefaultImage } from "src/utils/default-image";

@Injectable()
export class UsersServiceAdapter implements UsersServiceInterface {

   private readonly logger: Logger = new Logger(UsersServiceAdapter.name);

   constructor(
      private readonly dataService: DataServiceInterface,
      private readonly imageHandlerService: ImageHandlerInterface
   ) { }

   async getUserByEmail(email: string): Promise<User> {
      this.logger.log(`Getting user: ${email}`);
      return await this.dataService.users.getByEmail(email);
   }

   async getUserById(id: string): Promise<User> {
      this.logger.log(`Getting user: ${id}`);
      return await this.dataService.users.getById(id);
   }

   async updateUser(entity: UpdateUserDto, image: Express.Multer.File): Promise<User> {
      this.logger.log(`Updating user: ${entity.name}`);
      try {
         const user = await this.dataService.users.getByEmail(entity.email);
         if (!user) {
            throw new NotFoundException(`User with email ${entity.email} not found`);
         }
         if (image) {
            this.logger.log('Image provided for update');
            const defaultImage = getDefaultImage();
            if (user.image !== defaultImage) {
               await this.imageHandlerService.deleteImage(user.image);
            }
            entity.image = await this.uploadImage(image);
         }
         Object.assign(user, entity);
         return await this.dataService.users.updateByEmail(user.email, user);
      } catch (error) {
         this.logger.error('Error updating user');
         this.logger.error(error);
         throw new HttpException({
            statusCode: error.response.statusCode,
            error: 'Error updating user',
            message: error.message
         }, error.response.statusCode);
      }
   }

   async updatePassword(entity: UpdatePasswordDto): Promise<User> {
      this.logger.log(`Updating password: ${entity.id}`);
      const user = await this.dataService.users.getById(entity.id);
      if (user.password !== entity.oldPassword) {
         throw new UnauthorizedException('Invalid old password');
      }
      return await this.dataService.users.updatePassword(entity.id, entity);
   }

   private async uploadImage(image: Express.Multer.File): Promise<string> {
      this.logger.log('Uploading image');
      const imageHandlerResponse = await this.imageHandlerService.uploadImage(image);
      if (imageHandlerResponse.error) {
         throw new Error(imageHandlerResponse.error);
      }
      this.logger.log('Image uploaded successfully');
      this.logger.log(JSON.stringify(imageHandlerResponse, null, 2));
      return imageHandlerResponse.url;
   }

}
