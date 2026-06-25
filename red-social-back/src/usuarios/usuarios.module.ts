import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AdminGuard } from '../guards/admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),

    CloudinaryModule,

    JwtModule.register({
      secret: 'programacion4'
    })

  ],

  controllers: [UsuariosController],

  providers: [
    UsuariosService,
    AdminGuard
  ],

  exports: [
    MongooseModule,
    UsuariosService
  ],
})
export class UsuariosModule {}