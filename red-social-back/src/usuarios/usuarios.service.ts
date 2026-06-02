import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Usuario } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async crear(usuario: any) {
    return await this.usuarioModel.create(usuario);
  }

  async login(usuario: string, password: string) {

  const usuarioEncontrado = await this.usuarioModel.findOne({
    $or: [
      { usuario: usuario },
      { correo: usuario }
    ]
  });

  if (!usuarioEncontrado) {
    return null;
  }

  if (usuarioEncontrado.password !== password) {
    return null;
  }

  return usuarioEncontrado;

}

}