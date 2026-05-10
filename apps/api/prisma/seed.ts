// ─────────────────────────────────────────────────────────────────────────────
// prisma/seed.ts
// Popula o banco com dados iniciais para desenvolvimento e testes.
// Executar com: npm run db:seed
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Igreja base ──────────────────────────────────────────────────────────
  const igreja = await prisma.igreja.upsert({
    where: { id: 'igreja-itapetininga-01' },
    update: {},
    create: {
      id: 'igreja-itapetininga-01',
      nome: 'Igreja Adventista Central — Itapetininga',
      endereco: 'Rua XV de Novembro, 200',
      cidade: 'Itapetininga',
      estado: 'SP',
      latitude: -23.5868,
      longitude: -48.0528,
      raioMetropolitanoKm: 20,
      ativa: true,
    },
  });
  console.log('✅ Igreja criada:', igreja.nome);

  // ── Administrador ────────────────────────────────────────────────────────
  const senhaAdmin = await bcrypt.hash('doame2025', 10);
  const admin = await prisma.administrador.upsert({
    where: { email: 'admin@doame.com' },
    update: {},
    create: {
      nome: 'Administrador ASA',
      email: 'admin@doame.com',
      senhaHash: senhaAdmin,
      papel: 'ADMIN',
      igrejaId: igreja.id,
    },
  });
  console.log('✅ Administrador criado:', admin.email);

  // ── Voluntários ──────────────────────────────────────────────────────────
  const senhaVol = await bcrypt.hash('voluntario123', 10);

  const voluntarios = [
    {
      id: 'vol-01',
      nome: 'Carlos Mendonça',
      email: 'carlos.mendonca@email.com',
      telefone: '(15) 99812-3344',
      whatsapp: '(15) 99812-3344',
      endereco: 'Rua das Acácias, 42',
      latitude: -23.584,
      longitude: -48.051,
      aprovado: true,
      disponivel: true,
    },
    {
      id: 'vol-02',
      nome: 'Fernanda Rocha',
      email: 'fernanda.rocha@email.com',
      telefone: '(15) 98877-5566',
      whatsapp: '(15) 98877-5566',
      endereco: 'Av. Brasil, 310',
      latitude: -23.589,
      longitude: -48.055,
      aprovado: true,
      disponivel: true,
    },
    {
      id: 'vol-03',
      nome: 'João Batista Lima',
      email: 'joao.lima@email.com',
      telefone: '(15) 97766-4455',
      whatsapp: null,
      endereco: 'Rua Sete de Setembro, 88',
      latitude: -23.591,
      longitude: -48.048,
      aprovado: true,
      disponivel: false,
    },
    {
      id: 'vol-04',
      nome: 'Maria Aparecida Santos',
      email: 'maria.santos@email.com',
      telefone: '(15) 99100-2233',
      whatsapp: '(15) 99100-2233',
      endereco: 'Rua das Flores, 15',
      latitude: -23.583,
      longitude: -48.052,
      aprovado: true,
      disponivel: true,
    },
  ];

  for (const v of voluntarios) {
    await prisma.voluntario.upsert({
      where: { email: v.email },
      update: {},
      create: {
        ...v,
        senhaHash: senhaVol,
        ativo: true,
        igrejaId: igreja.id,
      },
    });
  }
  console.log('✅ Voluntários criados:', voluntarios.length);

  // ── Palavras-chave bíblicas ───────────────────────────────────────────────
  const palavras = [
    { termo: 'Bétel', referenciaBiblica: 'Gênesis 28:19', significado: 'Casa de Deus — lugar onde Jacó encontrou o Senhor' },
    { termo: 'Siloé', referenciaBiblica: 'João 9:7', significado: 'Enviado — piscina onde o cego recebeu a visão' },
    { termo: 'Maranata', referenciaBiblica: '1 Coríntios 16:22', significado: 'O Senhor vem — expressão de esperança' },
    { termo: 'Ebenézer', referenciaBiblica: '1 Samuel 7:12', significado: 'Até aqui o Senhor nos ajudou' },
    { termo: 'Gileade', referenciaBiblica: 'Jeremias 8:22', significado: 'Região conhecida por seu bálsamo curativo' },
    { termo: 'Sião', referenciaBiblica: 'Salmos 48:2', significado: 'Monte sagrado — símbolo da cidade de Deus' },
    { termo: 'Peniel', referenciaBiblica: 'Gênesis 32:30', significado: 'Face de Deus — onde Jacó lutou com o anjo' },
    { termo: 'Horeb', referenciaBiblica: 'Êxodo 3:1', significado: 'Monte de Deus — onde Moisés viu a sarça ardente' },
    { termo: 'Nazaré', referenciaBiblica: 'Lucas 1:26', significado: 'Cidade onde Jesus cresceu' },
    { termo: 'Betânia', referenciaBiblica: 'João 11:1', significado: 'Casa da aflição — onde Lázaro foi ressuscitado' },
    { termo: 'Carmelo', referenciaBiblica: '1 Reis 18:19', significado: 'Monte onde Elias confrontou os profetas de Baal' },
    { termo: 'Selá', referenciaBiblica: 'Salmos 3:4', significado: 'Pausa para reflexão — usada nos Salmos' },
    { termo: 'Moriá', referenciaBiblica: 'Gênesis 22:2', significado: 'Monte do sacrifício — onde Abraão ofereceu Isaque' },
    { termo: 'Gabaon', referenciaBiblica: '1 Reis 3:5', significado: 'Lugar alto — onde Salomão pediu sabedoria a Deus' },
    { termo: 'Efrata', referenciaBiblica: 'Miquéias 5:2', significado: 'Outro nome de Belém — terra do pão' },
    { termo: 'Mispa', referenciaBiblica: '1 Samuel 7:5', significado: 'Atalaia — lugar de oração e vigilância' },
    { termo: 'Ramá', referenciaBiblica: '1 Samuel 1:19', significado: 'Lugar elevado — cidade de Samuel' },
    { termo: 'Cades', referenciaBiblica: 'Números 20:1', significado: 'Santo — onde Israel acampou no deserto' },
    { termo: 'Libnah', referenciaBiblica: 'Josué 10:29', significado: 'Brancura — cidade conquistada por Josué' },
    { termo: 'Laque', referenciaBiblica: 'Josué 10:31', significado: 'Cidade das planícies — símbolo de perseverança' },
  ];

  for (const p of palavras) {
    await prisma.palavraChave.upsert({
      where: { termo: p.termo },
      update: {},
      create: { ...p, ativa: true, emUso: false },
    });
  }
  console.log('✅ Palavras-chave bíblicas criadas:', palavras.length);

  // ── Doações de exemplo ───────────────────────────────────────────────────
  const doacoes = [
    {
      id: 'doacao-01',
      nomeDoador: 'Ana Paula',
      telefoneDoador: '(15) 99811-2233',
      whatsappDoador: '(15) 99811-2233',
      enderecoDoador: 'Rua das Palmeiras, 101 — Vila Nova, Itapetininga/SP',
      latitude: -23.582,
      longitude: -48.050,
      dataColeta: new Date('2025-07-30'),
      horarioColeta: '09:00',
      status: 'PENDENTE' as const,
      itens: [
        { categoria: 'ALIMENTO' as const, nome: 'Arroz', quantidade: 2 },
        { categoria: 'ALIMENTO' as const, nome: 'Feijão', quantidade: 3 },
      ],
    },
    {
      id: 'doacao-02',
      nomeDoador: 'Roberto Farias',
      telefoneDoador: '(15) 98833-4455',
      whatsappDoador: null,
      enderecoDoador: 'Av. Central, 55 Apto 3 — Centro, Itapetininga/SP',
      latitude: -23.589,
      longitude: -48.054,
      dataColeta: new Date('2025-07-29'),
      horarioColeta: '14:00',
      status: 'AGUARDANDO' as const,
      itens: [
        { categoria: 'AGASALHO' as const, nome: 'Cobertor', quantidade: 2 },
        { categoria: 'AGASALHO' as const, nome: 'Blusa de Frio', quantidade: 4 },
      ],
    },
    {
      id: 'doacao-03',
      nomeDoador: 'Carla Nunes',
      telefoneDoador: '(15) 97744-6677',
      whatsappDoador: '(15) 97744-6677',
      enderecoDoador: 'Rua Progresso, 310 — Jardim Paulista, Itapetininga/SP',
      latitude: -23.591,
      longitude: -48.047,
      dataColeta: new Date('2025-07-28'),
      horarioColeta: '10:30',
      status: 'ENTREGUE' as const,
      itens: [
        { categoria: 'FINANCEIRA' as const, nome: 'Dinheiro / Pix', quantidade: 1 },
      ],
    },
  ];

  for (const d of doacoes) {
    const { itens, ...dadosDoacao } = d;
    await prisma.doacao.upsert({
      where: { id: d.id },
      update: {},
      create: {
        ...dadosDoacao,
        igrejaId: igreja.id,
        itens: { create: itens },
      },
    });
  }
  console.log('✅ Doações de exemplo criadas:', doacoes.length);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('─────────────────────────────────────');
  console.log('📧 Admin:    admin@doame.com');
  console.log('🔑 Senha:    doame2025');
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
