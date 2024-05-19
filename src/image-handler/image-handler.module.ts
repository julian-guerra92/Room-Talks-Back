import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './image-handler.provider';
import { ImageHandlerAdapter } from './image-handler.service';
import { ImageHandlerInterface } from './interface/image-hanlder';


const ImageHandlerService = {
   provide: ImageHandlerInterface,
   useClass: ImageHandlerAdapter
}

@Module({
   providers: [
      ImageHandlerService,
      CloudinaryProvider
   ],
   exports: [CloudinaryProvider, ImageHandlerService],
})
export class ImageHanlderModule { }