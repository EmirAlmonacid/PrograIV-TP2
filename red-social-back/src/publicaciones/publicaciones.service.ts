import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Publicacion } from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {

    constructor(
        @InjectModel(Publicacion.name)
        private publicacionModel: Model<Publicacion>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async crear(
        publicacion: any,
        file?: any
    ) {

        // Si la publicación tiene imagen, se sube a Cloudinary
        if (file) {

            const imagenSubida =
                await this.cloudinaryService.uploadImage(file);

            publicacion.imagen =
                (imagenSubida as any).secure_url;

        }

        return await this.publicacionModel.create(
            publicacion
        );

    }

    async obtenerTodas(
        orden?: string,
        usuarioId?: string,
        offset = 0,
        limit = 5
    ) {

        const filtro: any = {
            activo: true
        };

        // Permite filtrar publicaciones de un usuario específico
        if (usuarioId) {

            filtro.usuarioId = usuarioId;

        }

        const publicaciones =
            await this.publicacionModel
                .find(filtro);

        // Ordena según el criterio recibido desde el frontend
        if (orden === 'likes') {

            publicaciones.sort(
                (a: any, b: any) =>
                    b.likes.length - a.likes.length
            );

        } else {

            publicaciones.sort(
                (a: any, b: any) =>
                    new Date(b.fechaCreacion).getTime()
                    -
                    new Date(a.fechaCreacion).getTime()
            );

        }

        // Paginación
        return publicaciones.slice(
            Number(offset),
            Number(offset) + Number(limit)
        );

    }

    async eliminar(id: string) {

        // Baja lógica: la publicación sigue existiendo en Mongo
        return await this.publicacionModel.findByIdAndUpdate(
            id,
            {
                activo: false
            },
            {
                new: true
            }
        );

    }

    async darLike(
        publicacionId: string,
        usuarioId: string
    ) {

        // $addToSet evita likes duplicados
        return await this.publicacionModel.findByIdAndUpdate(
            publicacionId,
            {
                $addToSet: {
                    likes: usuarioId
                }
            },
            {
                new: true
            }
        );

    }

    async quitarLike(
        publicacionId: string,
        usuarioId: string
    ) {

        return await this.publicacionModel.findByIdAndUpdate(
            publicacionId,
            {
                $pull: {
                    likes: usuarioId
                }
            },
            {
                new: true
            }
        );

    }

    async comentar(
        publicacionId: string,
        comentario: any
    ) {

        return await this.publicacionModel.findByIdAndUpdate(
            publicacionId,
            {
                $push: {
                    comentarios: {
                        usuarioId: comentario.usuarioId,
                        usuario: comentario.usuario,
                        texto: comentario.texto,
                        fecha: new Date()
                    }
                }
            },
            {
                new: true
            }
        );

    }

}

