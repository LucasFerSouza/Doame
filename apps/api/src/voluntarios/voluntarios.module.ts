import { Module } from '@nestjs/common';
import { VoluntariosService } from './voluntarios.service';
import { VoluntariosController } from './voluntarios.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VoluntariosController],
  providers: [VoluntariosService],
})
export class VoluntariosModule {}
