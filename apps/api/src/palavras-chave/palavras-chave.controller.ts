import { Controller, Get, UseGuards } from '@nestjs/common';
import { PalavrasChaveService } from './palavras-chave.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('palavras-chave')
export class PalavrasChaveController {
  constructor(private service: PalavrasChaveService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('disponivel')
  sortearDisponivel() { return this.service.sortearDisponivel(); }
}
