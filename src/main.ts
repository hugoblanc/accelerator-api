import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://127.0.0.1:4200',
      'http://localhost:4200',
      'https://accelerator.inv.agicapcollect.com',
    ],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
