import { PapelAdmin } from '@prisma/client';

// No arquivo administradores.dto.ts
export class CreateAdminDto {
  nome: string;
  email: string;
  senha: string;
  papel?: PapelAdmin; // Mude de string para PapelAdmin
  igrejaId: string;
}