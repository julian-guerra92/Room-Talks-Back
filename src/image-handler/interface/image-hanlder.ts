import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export abstract class ImageHandlerInterface {
   abstract uploadImage(image: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>;
   abstract deleteImage(imageUrl: string): Promise<void>;
}