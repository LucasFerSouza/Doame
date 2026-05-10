import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';

@Controller('cep')
export class CepController {
  constructor(private cepService: CepService) {}

  // GET /api/cep/:cep — consulta ViaCEP e retorna endereço estruturado
  @Get(':cep')
  buscar(@Param('cep') cep: string) {
    return this.cepService.buscar(cep);
  }
}
