import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  const configService = app.get(ConfigService);
  const logger: Logger = new Logger('Main');

  // app.useWebSocketAdapter(new WsAdapter(app));
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
    logger.log(`URL de conexión: http://localhost:${PORT}/`);
  });

  
}
bootstrap();
