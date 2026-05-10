import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DoacoesModule } from './doacoes/doacoes.module';
import { VoluntariosModule } from './voluntarios/voluntarios.module';
import { AdministradoresModule } from './administradores/administradores.module';
import { PalavrasChaveModule } from './palavras-chave/palavras-chave.module';
import { CepModule } from './cep/cep.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DoacoesModule,
    VoluntariosModule,
    AdministradoresModule,
    PalavrasChaveModule,
    CepModule,
  ],
})
export class AppModule {}
