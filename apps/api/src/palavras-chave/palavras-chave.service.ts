import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PalavrasChaveService {
  constructor(private prisma: PrismaService) {}

  // GET /api/palavras-chave — lista todas (uso interno do admin)
  findAll() {
    return this.prisma.palavraChave.findMany({
      orderBy: { termo: 'asc' },
    });
  }

  // GET /api/palavras-chave/disponivel — sorteia uma palavra disponível
  async sortearDisponivel() {
    const disponiveis = await this.prisma.palavraChave.findMany({
      where: { ativa: true, emUso: false },
    });
    if (disponiveis.length === 0) return null;
    const idx = Math.floor(Math.random() * disponiveis.length);
    return disponiveis[idx];
  }
}
