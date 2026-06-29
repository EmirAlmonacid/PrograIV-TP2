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

    // Verifica que el nombre de usuario y el correo no se encuentren registrados.
    const usuarioExistente =
      await this.usuarioModel.findOne({
        usuario: usuario.usuario
      });

    const correoExistente =
      await this.usuarioModel.findOne({
        correo: usuario.correo
      });

    if (
      usuarioExistente &&
      correoExistente
    ) {

      return {
        error: true,
        mensaje:
          'El usuario y el correo ya están registrados'
      };

    }

    if (usuarioExistente) {

      return {
        error: true,
        mensaje:
          'El usuario ya está registrado'
      };

    }

    if (correoExistente) {

      return {
        error: true,
        mensaje:
          'El correo ya está registrado'
      };

    }

    // Si el usuario cargó una imagen, se almacena en Cloudinary.
    if (file) {

      const imagenSubida =
        await this.cloudinaryService.uploadImage(file);

      usuario.foto = (imagenSubida as any).secure_url;

    } else {

      // Asigna una imagen por defecto cuando no se selecciona una foto.
      usuario.foto =
        'https://res.cloudinary.com/drh8becix/image/upload/v1781308140/avatar_kvowju.webp';

    }

    // Encripta la contraseña antes de guardarla en la base de datos.
    const passwordEncriptada =
      await bcrypt.hash(usuario.password, 10);

    usuario.password = passwordEncriptada;

    return await this.usuarioModel.create(usuario);

  }

  async login(usuario: string, password: string) {

    // Permite iniciar sesión utilizando
    // el nombre de usuario o el correo.
    const usuarioEncontrado = await this.usuarioModel.findOne({
      $or: [
        { usuario: usuario },
        { correo: usuario }
      ]
    });

    if (!usuarioEncontrado) {
      return null;
    }

    // Verifica que la cuenta
    // se encuentre habilitada.
    if (!usuarioEncontrado.activo) {
      return {
        error: true,
        mensaje: 'Usuario deshabilitado'
      };
    }

    // Compara la contraseña ingresada con la almacenada de forma encriptada.
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

  // Devuelve el listado completo de usuarios registrados.
  async obtenerTodos() {
    return await this.usuarioModel.find();
  }

  // Obtiene los diez usuarios
  // registrados más recientemente.
  async obtenerUltimos() {

    return await this.usuarioModel
      .find()
      .sort({
        _id: -1
      })
      .limit(10);

  }

  async actualizar(
    id: string,
    datos: any,
    file?: any
  ) {

    // Si se carga una nueva imagen,
    // reemplaza la foto de perfil.
    if (file) {

      const imagenSubida =
        await this.cloudinaryService
          .uploadImage(file);

      datos.foto =
        (imagenSubida as any)
          .secure_url;

    }

    return await this.usuarioModel
      .findByIdAndUpdate(
        id,
        datos,
        { new: true }
      );

  }

  // Deshabilita la cuenta del usuario sin eliminar el registro de la base de datos.
  async deshabilitar(id: string) {

    return await this.usuarioModel.findByIdAndUpdate(
      id,
      {
        activo: false
      },
      {
        new: true
      }
    );

  }

  // Reactiva una cuenta previamente deshabilitada.
  async habilitar(id: string) {

    return await this.usuarioModel.findByIdAndUpdate(
      id,
      {
        activo: true
      },
      {
        new: true
      }
    );

  }

}