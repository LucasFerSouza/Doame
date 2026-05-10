import { Injectable, BadRequestException } from '@nestjs/common';

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

@Injectable()
export class CepService {
  async buscar(cep: string) {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      throw new BadRequestException('CEP deve ter 8 dígitos');
    }

    let data: ViaCepResponse;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch {
      throw new BadRequestException('Erro ao consultar o serviço de CEP');
    }

    if (data.erro) {
      throw new BadRequestException('CEP não encontrado');
    }

    return {
      cep: data.cep ?? '',
      logradouro: data.logradouro ?? '',
      complemento: data.complemento ?? '',
      bairro: data.bairro ?? '',
      municipio: data.localidade ?? '',
      estado: data.uf ?? '',
    };
  }
}
