import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
    CloudinaryModule
  ],

  controllers: [UsuariosController],

  providers: [UsuariosService],

  exports: [MongooseModule, UsuariosService],
})
export class UsuariosModule {}