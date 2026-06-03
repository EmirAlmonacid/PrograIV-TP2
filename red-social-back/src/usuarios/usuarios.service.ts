import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async crear(usuario: any) {

  const passwordEncriptada =
    await bcrypt.hash(usuario.password, 10);

  usuario.password = passwordEncriptada;

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

  const passwordCorrecta =
  await bcrypt.compare(
    password,
    usuarioEncontrado.password
  );

  if (!passwordCorrecta) {
    return null;
  }

  return usuarioEncontrado;

  
}

async obtenerTodos() {
  return await this.usuarioModel.find();
}

}