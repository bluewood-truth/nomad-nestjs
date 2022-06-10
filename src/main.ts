import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // decorator가 없는 property는 제외함
      forbidNonWhitelisted: true, // property를 제외하는 대신 예외를 던짐
      transform: true, // 요청 데이터의 타입을 자동으로 변환함
    }),
  );
  await app.listen(3000);
}
bootstrap();
