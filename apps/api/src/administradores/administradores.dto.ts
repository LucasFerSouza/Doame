import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PapelAdmin } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsOptional()
  @IsEnum(PapelAdmin)
  papel?: PapelAdmin;

  @IsString()
  igrejaId: string;
}