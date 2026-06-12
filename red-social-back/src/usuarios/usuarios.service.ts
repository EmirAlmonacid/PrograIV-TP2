import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async crear(
  usuario: any,
  file?: any,
) {

  const usuarioExistente =
    await this.usuarioModel.findOne({
      $or: [
        { usuario: usuario.usuario },
        { correo: usuario.correo }
      ]
    });

  if (usuarioExistente) {

    return {
      error: true,
      mensaje: 'Usuario o correo ya existe'
    };

  }

  if (file) {

    const imagenSubida =
      await this.cloudinaryService.uploadImage(file);

    usuario.foto = (imagenSubida as any).secure_url;

  }
const usuarioExistente =
  await this.usuarioModel.findOne({
    $or: [
      { usuario: usuario.usuario },
      { correo: usuario.correo }
    ]
  });

console.log('USUARIO EXISTENTE:', usuarioExistente);

if (usuarioExistente) {

  console.log('ENTRO AL IF');

  return {
    error: true,
    mensaje: 'Usuario o correo ya existe'
  };

}
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