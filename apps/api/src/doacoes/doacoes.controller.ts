import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoacoesService } from './doacoes.service';
import { CreateDoacaoDto, UpdateStatusDoacaoDto, AtribuirVoluntarioDto } from './doacoes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doacoes')
export class DoacoesController {
  constructor(private doacoesService: DoacoesService) {}

  // GET /api/doacoes — rota pública (admin visualiza via painel, mas listagem é protegida)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('igrejaId') igrejaId?: string) {
    return this.doacoesService.findAll(igrejaId);
  }

  // GET /api/doacoes/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doacoesService.findOne(id);
  }

  // GET /api/doacoes/:id/voluntarios-sugeridos
  // Conecta com: AtribuirDialog.tsx → substituir sugerirVoluntarios() do mockData
  @UseGuards(JwtAuthGuard)
  @Get(':id/voluntarios-sugeridos')
  voluntariosSugeridos(@Param('id') id: string) {
    return this.doacoesService.voluntariosSugeridos(id);
  }

  // POST /api/doacoes — rota PÚBLICA (doador não tem login)
  // Conecta com: StepContato.tsx → onEnviar() — substituir o alert()
  @Post()
  create(@Body() dto: CreateDoacaoDto) {
    return this.doacoesService.create(dto);
  }

  // PATCH /api/doacoes/:id/status
  // Conecta com: DoacaoDialog.tsx → handleStatusChange()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDoacaoDto) {
    return this.doacoesService.updateStatus(id, dto);
  }

  // POST /api/doacoes/:id/atribuir
  // Conecta com: AtribuirDialog.tsx → onAtribuir()
  @UseGuards(JwtAuthGuard)
  @Post(':id/atribuir')
  atribuir(@Param('id') id: string, @Body() dto: AtribuirVoluntarioDto) {
    return this.doacoesService.atribuirVoluntario(id, dto);
  }
}
