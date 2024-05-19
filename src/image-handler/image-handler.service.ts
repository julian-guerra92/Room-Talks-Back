import { Injectable, Logger } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

import { ImageHandlerInterface } from "./interface/image-hanlder";


@Injectable()
export class ImageHandlerAdapter implements ImageHandlerInterface {

   logger: Logger = new Logger('ImageHandler');

   async uploadImage(image: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
      this.logger.log('Iniciando proceso uploadImage');
      return new Promise((resolve, reject) => {
         const upload = cloudinary.uploader.upload_stream({ folder: 'RoomTalks' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
         });
         toStream(image.buffer).pipe(upload);
      });
   }

   async deleteImage(imageUrl: string): Promise<void> {
      this.logger.log('Iniciando proceso deleteImage');
      return new Promise((resolve, reject) => {
         const publicId = imageUrl.split('/').pop().split('.')[0];
         cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve();
         });
      });
   }
}