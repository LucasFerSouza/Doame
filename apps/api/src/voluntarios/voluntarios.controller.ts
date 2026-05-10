import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { VoluntariosService } from './voluntarios.service';
import { CreateVoluntarioDto, UpdateVoluntarioDto, ConfirmacaoAdminDto } from './voluntarios.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('voluntarios')
export class VoluntariosController {
  constructor(private voluntariosService: VoluntariosService) {}

  // GET /api/voluntarios
  // Conecta com: VoluntariosList.tsx
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('igrejaId') igrejaId?: string) {
    return this.voluntariosService.findAll(igrejaId);
  }

  // GET /api/voluntarios/:id
  // Conecta com: VoluntarioDialog.tsx
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voluntariosService.findOne(id);
  }

  // POST /api/voluntarios — cadastro público (sem login)
  @Post()
  create(@Body() dto: CreateVoluntarioDto) {
    return this.voluntariosService.create(dto);
  }

  // PATCH /api/voluntarios/:id
  // Exige JWT + senha do admin no body para confirmar a edição
  // Conecta com: VoluntarioDialog.tsx → ação de editar com confirmação
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateVoluntarioDto,
  ) {
    return this.voluntariosService.update(id, req.user.id, dto);
  }

  // DELETE /api/voluntarios/:id
  // Exige JWT + senha do admin no body para confirmar a exclusão
  // Conecta com: VoluntarioDialog.tsx → ação de excluir com confirmação
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ConfirmacaoAdminDto,
  ) {
    return this.voluntariosService.remove(id, req.user.id, dto);
  }
}
