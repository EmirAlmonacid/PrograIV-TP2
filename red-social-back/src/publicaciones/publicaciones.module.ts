import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

import {
  Publicacion,
  PublicacionSchema
} from './schemas/publicacion.schema';

import {
  Usuario,
  UsuarioSchema
} from '../usuarios/schemas/usuario.schema';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: PublicacionSchema
      },
      {
        name: Usuario.name,
        schema: UsuarioSchema
      }
    ]),
    CloudinaryModule
  ],
  controllers: [
    PublicacionesController
  ],
  providers: [
    PublicacionesService
  ]
})
export class PublicacionesModule {}