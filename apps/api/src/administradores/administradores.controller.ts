import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdministradoresService } from './administradores.service';
import { CreateAdminDto } from './administradores.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('administradores')
export class AdministradoresController {
  constructor(private service: AdministradoresService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateAdminDto) { return this.service.create(dto); }
}
