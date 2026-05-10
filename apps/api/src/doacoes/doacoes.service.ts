import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoacaoDto, UpdateStatusDoacaoDto, AtribuirVoluntarioDto } from './doacoes.dto';

@Injectable()
export class DoacoesService {
  constructor(private prisma: PrismaService) {}

  // GET /api/doacoes
  // Conecta com: DoacoesList.tsx → busca da lista de doações
  async findAll(igrejaId?: string) {
    return this.prisma.doacao.findMany({
      where: igrejaId ? { igrejaId } : undefined,
      include: {
        itens: true,
        palavraChave: true,
        atribuicoes: {
          include: { voluntario: true },
          orderBy: { atribuidaEm: 'desc' },
          take: 1,
        },
      },
      orderBy: { criadaEm: 'desc' },
    });
  }

  // GET /api/doacoes/:id
  // Conecta com: DoacaoDialog.tsx → detalhes completos ao clicar no card
  async findOne(id: string) {
    const doacao = await this.prisma.doacao.findUnique({
      where: { id },
      include: {
        itens: true,
        palavraChave: true,
        doacaoFinanceira: true,
        atribuicoes: {
          include: { voluntario: true },
          orderBy: { atribuidaEm: 'desc' },
        },
      },
    });
    if (!doacao) throw new NotFoundException('Doação não encontrada');
    return doacao;
  }

  // POST /api/doacoes
  // Conecta com: StepContato.tsx → onEnviar() — substituir o alert()
  async create(dto: CreateDoacaoDto) {
    return this.prisma.doacao.create({
      data: {
        nomeDoador: dto.nomeDoador,
        telefoneDoador: dto.telefoneDoador,
        whatsappDoador: dto.whatsappDoador,
        enderecoDoador: dto.enderecoDoador,
        latitude: dto.latitude,
        longitude: dto.longitude,
        dataColeta: new Date(dto.dataColeta),
        horarioColeta: dto.horarioColeta,
        igrejaId: dto.igrejaId,
        itens: {
          create: dto.itens,
        },
      },
      include: { itens: true },
    });
  }

  // PATCH /api/doacoes/:id/status
  // Conecta com: DoacaoDialog.tsx → Select de status (handleStatusChange)
  async updateStatus(id: string, dto: UpdateStatusDoacaoDto) {
    await this.findOne(id);

    const data: any = { status: dto.status };

    // Anonimiza dados do doador quando status = ENTREGUE (conforme LGPD)
    if (dto.status === 'ENTREGUE') {
      data.nomeDoador = null;
      data.telefoneDoador = null;
      data.whatsappDoador = null;
      data.enderecoDoador = null;
      data.anonimizacaoEm = new Date();

      // Libera a palavra-chave para reuso
      const doacao = await this.prisma.doacao.findUnique({ where: { id } });
      if (doacao?.palavraChaveId) {
        await this.prisma.palavraChave.update({
          where: { id: doacao.palavraChaveId },
          data: { emUso: false },
        });
        data.palavraChaveId = null;
      }
    }

    return this.prisma.doacao.update({ where: { id }, data });
  }

  // POST /api/doacoes/:id/atribuir
  // Conecta com: AtribuirDialog.tsx → botão "Atribuir" (onAtribuir)
  async atribuirVoluntario(id: string, dto: AtribuirVoluntarioDto) {
    const doacao = await this.findOne(id);

    // Verifica se voluntário está disponível
    const voluntario = await this.prisma.voluntario.findUnique({
      where: { id: dto.voluntarioId },
    });
    if (!voluntario || !voluntario.disponivel || !voluntario.aprovado) {
      throw new BadRequestException('Voluntário não está disponível');
    }

    // Sorteio de palavra-chave disponível
    const palavraChave = await this.prisma.palavraChave.findFirst({
      where: { ativa: true, emUso: false },
    });

    // Cria registro de atribuição
    await this.prisma.atribuicaoVoluntarioDoacao.create({
      data: {
        doacaoId: id,
        voluntarioId: dto.voluntarioId,
        raioVarreduraKm: 5, // MVP: valor fixo, futuro: calculado dinamicamente
        status: 'PENDENTE',
      },
    });

    // Atualiza doação e palavra-chave
    const updateData: any = {
      status: 'AGUARDANDO',
    };

    if (palavraChave) {
      updateData.palavraChaveId = palavraChave.id;
      await this.prisma.palavraChave.update({
        where: { id: palavraChave.id },
        data: { emUso: true },
      });
    }

    return this.prisma.doacao.update({
      where: { id },
      data: updateData,
      include: { itens: true, palavraChave: true },
    });
  }

  // GET /api/doacoes/:id/voluntarios-sugeridos
  // Conecta com: AtribuirDialog.tsx → sugerirVoluntarios() (substituir mock)
  async voluntariosSugeridos(id: string) {
    const doacao = await this.findOne(id);

    // Busca voluntários aprovados, ativos e disponíveis da mesma igreja
    const voluntarios = await this.prisma.voluntario.findMany({
      where: {
        igrejaId: doacao.igrejaId,
        aprovado: true,
        ativo: true,
        disponivel: true,
      },
    });

    // Score por proximidade de endereço (MVP: baseado no endereço textual)
    // Futuro: substituir por cálculo PostGIS com latitude/longitude
    const enderecoDoacao = doacao.enderecoDoador?.toLowerCase() || '';
    const bairroDoacao = this.extrairBairro(enderecoDoacao);

    const comScore = voluntarios.map((v) => {
      const enderecoVol = v.endereco.toLowerCase();
      const bairroVol = this.extrairBairro(enderecoVol);
      let score = 0;
      if (bairroVol && bairroDoacao && bairroVol === bairroDoacao) score = 2;
      else score = 1;
      return { ...v, score };
    });

    return comScore.sort((a, b) => b.score - a.score);
  }

  private extrairBairro(endereco: string): string {
    // Tenta extrair o bairro do formato "Rua X, N — Bairro, Cidade/UF"
    const match = endereco.match(/—\s*([^,]+)/);
    return match ? match[1].trim() : '';
  }
}
