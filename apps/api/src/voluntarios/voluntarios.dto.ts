import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateVoluntarioDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsString()
  telefone: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsString()
  endereco: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsString()
  igrejaId: string;
}

export class UpdateVoluntarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsBoolean()
  disponivel?: boolean;

  @IsOptional()
  @IsBoolean()
  aprovado?: boolean;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  // Senha do administrador — obrigatória para editar ou excluir
  @IsString()
  senhaAdmin: string;
}

export class ConfirmacaoAdminDto {
  // Enviada no body para confirmar ações destrutivas (exclusão)
  @IsString()
  senhaAdmin: string;
}
