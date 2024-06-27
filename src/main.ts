import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = configService.get('PORT');
  app.enableCors();
  await app.listen(PORT);
  console.log(`listening in ${await app.getUrl()}`);
}
bootstrap();
