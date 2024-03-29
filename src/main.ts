import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  const configService = app.get(ConfigService);
  const logger: Logger = new Logger('Main');

  app.enableCors({ origin: '*' });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const PORT = configService.get('PORT');

  await app.listen(PORT, () => {
    logger.log(`Ejecutándose en puerto: ${PORT}`);
    logger.log(`URL de conexión: ws://localhost:${PORT}/`);
  });

  
}
bootstrap();
