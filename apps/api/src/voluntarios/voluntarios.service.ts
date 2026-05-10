import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateVoluntarioDto, UpdateVoluntarioDto, ConfirmacaoAdminDto } from './voluntarios.dto';

@Injectable()
export class VoluntariosService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  // GET /api/voluntarios
  // Conecta com: VoluntariosList.tsx → lista de voluntários no painel
  async findAll(igrejaId?: string) {
    return this.prisma.voluntario.findMany({
      where: igrejaId ? { igrejaId } : undefined,
      select: {
        id: true, nome: true, email: true, telefone: true,
        whatsapp: true, endereco: true, aprovado: true,
        ativo: true, disponivel: true, igrejaId: true, criadoEm: true,
        // senhaHash NUNCA é retornada
      },
      orderBy: { nome: 'asc' },
    });
  }

  // GET /api/voluntarios/:id
  // Conecta com: VoluntarioDialog.tsx → detalhes do voluntário
  async findOne(id: string) {
    const voluntario = await this.prisma.voluntario.findUnique({
      where: { id },
      select: {
        id: true, nome: true, email: true, telefone: true,
        whatsapp: true, endereco: true, aprovado: true,
        ativo: true, disponivel: true, igrejaId: true, criadoEm: true,
        atribuicoes: { orderBy: { atribuidaEm: 'desc' } },
      },
    });
    if (!voluntario) throw new NotFoundException('Voluntário não encontrado');
    return voluntario;
  }

  // POST /api/voluntarios — cadastro público (doador se cadastra como voluntário)
async create(dto: CreateVoluntarioDto) {
  const existe = await this.prisma.voluntario.findUnique({
    where: { email: dto.email },
  });
  if (existe) throw new BadRequestException('E-mail já cadastrado');

  const { igrejaId, ...dados } = dto;

  return this.prisma.voluntario.create({
    data: {
      ...dados,
      aprovado: false,
      igreja: {
        connect: { id: igrejaId }
      }
    },
    select: {
      id: true,
      nome: true,
      email: true,
      aprovado: true,
      criadoEm: true,
    },
  });
}

  // PATCH /api/voluntarios/:id
  // Conecta com: VoluntarioDialog.tsx → edição (exige confirmação de senha do admin)
  async update(id: string, adminId: string, dto: UpdateVoluntarioDto) {
    await this.findOne(id);

    // ── Confirmação de identidade do administrador ────────────────────────
    const senhaValida = await this.authService.verificarSenha(adminId, dto.senhaAdmin);
    if (!senhaValida) {
      throw new ForbiddenException('Senha do administrador incorreta');
    }

    const { senhaAdmin, ...dadosAtualizar } = dto;

    return this.prisma.voluntario.update({
      where: { id },
      data: dadosAtualizar,
      select: {
        id: true, nome: true, email: true, aprovado: true,
        ativo: true, disponivel: true,
      },
    });
  }

  // DELETE /api/voluntarios/:id
  // Conecta com: VoluntarioDialog.tsx → exclusão (exige confirmação de senha do admin)
  async remove(id: string, adminId: string, dto: ConfirmacaoAdminDto) {
    await this.findOne(id);

    // ── Confirmação de identidade do administrador ────────────────────────
    const senhaValida = await this.authService.verificarSenha(adminId, dto.senhaAdmin);
    if (!senhaValida) {
      throw new ForbiddenException('Senha do administrador incorreta');
    }

    // Soft delete: desativa em vez de apagar (preserva histórico de atribuições)
    return this.prisma.voluntario.update({
      where: { id },
      data: { ativo: false },
      select: { id: true, nome: true, ativo: true },
    });
  }
}
