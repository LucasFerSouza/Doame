import {
  IsString, IsOptional, IsArray, ValidateNested,
  IsEnum, IsNumber, IsPositive, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDoacaoDto {
  @IsEnum(['ALIMENTO', 'AGASALHO', 'FINANCEIRA'])
  categoria: 'ALIMENTO' | 'AGASALHO' | 'FINANCEIRA';

  @IsString()
  nome: string;

  @IsNumber()
  @IsPositive()
  quantidade: number;
}

export class CreateDoacaoDto {
  @IsString()
  nomeDoador: string;

  @IsString()
  telefoneDoador: string;

  @IsOptional()
  @IsString()
  whatsappDoador?: string;

  @IsString()
  enderecoDoador: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsDateString()
  dataColeta: string;

  @IsString()
  horarioColeta: string;

  @IsString()
  igrejaId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDoacaoDto)
  itens: ItemDoacaoDto[];
}

export class UpdateStatusDoacaoDto {
  @IsEnum(['PENDENTE', 'AGUARDANDO', 'CONFIRMADO', 'NEGADO', 'ATRIBUIDO', 'COLETADO', 'ENTREGUE'])
  status: string;
}

export class AtribuirVoluntarioDto {
  @IsString()
  voluntarioId: string;
}
