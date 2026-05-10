import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ──────────────────────────────────────────────────────────────────
  // Permite que o frontend Next.js (localhost:3000) acesse a API.
  // Em produção, substitua pela URL real do frontend.
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ── Validação global ──────────────────────────────────────────────────────
  // Valida automaticamente todos os DTOs usando class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // remove campos não declarados no DTO
      forbidNonWhitelisted: true,
      transform: true,        // converte tipos automaticamente
    }),
  );

  // ── Prefixo global da API ─────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 doame-api rodando em http://localhost:${port}/api`);
}

bootstrap();
