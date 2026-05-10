import { PapelAdmin } from '@prisma/client'; // Importe o Enum aqui
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './administradores.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdministradoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.administrador.findMany({
      select: { id: true, nome: true, email: true, papel: true, ativo: true, igrejaId: true },
    });
  }

  async findOne(id: string) {
    const admin = await this.prisma.administrador.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, papel: true, ativo: true, igrejaId: true },
    });
    if (!admin) throw new NotFoundException('Administrador não encontrado');
    return admin;
  }

 async create(dto: CreateAdminDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const { senha, igrejaId, ...outrosDados } = dto;

    return this.prisma.administrador.create({
      data: { 
        ...outrosDados, 
        senhaHash,
        // Forçamos o tipo aqui caso o DTO ainda use string
        papel: outrosDados.papel as PapelAdmin, 
        igreja: {
          connect: { id: igrejaId }
        }
      },
      select: { id: true, nome: true, email: true, papel: true },
    });
  }
}
