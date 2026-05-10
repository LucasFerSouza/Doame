import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // POST /api/auth/login
  // Substitui o login hardcoded do frontend
  async login(dto: LoginDto) {
    const admin = await this.prisma.administrador.findUnique({
      where: { email: dto.email },
      include: { igreja: true },
    });

    if (!admin || !admin.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaCorreta = await bcrypt.compare(dto.senha, admin.senhaHash);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      papel: admin.papel,
      igrejaId: admin.igrejaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        papel: admin.papel,
        igreja: admin.igreja.nome,
      },
    };
  }

  // Verifica senha do admin — usado para confirmar exclusão/edição de voluntário
  async verificarSenha(adminId: string, senha: string): Promise<boolean> {
    const admin = await this.prisma.administrador.findUnique({
      where: { id: adminId },
    });
    if (!admin) return false;
    return bcrypt.compare(senha, admin.senhaHash);
  }
}
