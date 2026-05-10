import { Module } from '@nestjs/common';
import { PalavrasChaveService } from './palavras-chave.service';
import { PalavrasChaveController } from './palavras-chave.controller';

@Module({
  controllers: [PalavrasChaveController],
  providers: [PalavrasChaveService],
})
export class PalavrasChaveModule {}
