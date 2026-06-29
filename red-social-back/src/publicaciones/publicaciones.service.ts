import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Publicacion } from './schemas/publicacion.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';

@Injectable()
export class PublicacionesService {

    constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,

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
                        fecha: new Date(),
                        editado: false
                    }
                }
            },
            {
                new: true
            }
        );

    }

    async editarComentario(
    publicacionId: string,
    comentarioIndex: number,
    texto: string
) {

    const publicacion =
        await this.publicacionModel.findById(
            publicacionId
        );

    if (!publicacion) {
        return null;
    }

    publicacion.comentarios[
        comentarioIndex
    ].texto = texto;

    publicacion.comentarios[
        comentarioIndex
    ].editado = true;

    publicacion.markModified(
        'comentarios'
    );

    await publicacion.save();

    return publicacion;

}

async obtenerComentarios(
    publicacionId: string,
    offset = 0,
    limit = 3
) {

    const publicacion =
        await this.publicacionModel.findById(
            publicacionId
        );

    if (!publicacion) {
        return [];
    }

    const comentarios =
        [...publicacion.comentarios];

    comentarios.sort(
        (a: any, b: any) =>
            new Date(b.fecha).getTime()
            -
            new Date(a.fecha).getTime()
    );

    return comentarios.slice(
        Number(offset),
        Number(offset) + Number(limit)
    );

}
async obtenerEstadisticasPublicaciones() {

    // Obtiene todas las publicaciones activas y los usuarios registrados.
    const publicaciones =
        await this.publicacionModel.find({
            activo: true
        });

    const usuarios =
        await this.usuarioModel.find();

    // Almacena la cantidad de publicaciones realizadas por cada usuario.
    const estadisticas: any[] = [];

    // Recorre todos los usuarios para contar sus publicaciones.
    for (const usuario of usuarios) {

        const cantidad =
            publicaciones.filter(
                (publicacion: any) =>
                    publicacion.usuarioId ===
                    usuario._id.toString()
            ).length;

        // Guarda el usuario junto con la cantidad de publicaciones para el gráfico.
        estadisticas.push({

            usuario: usuario.usuario,

            cantidad: cantidad

        });

    }

    return estadisticas;

}

async obtenerEstadisticasComentarios() {

    // Obtiene las publicaciones activas para calcular sus comentarios.
    const publicaciones =
        await this.publicacionModel.find({
            activo: true
        });

    // Devuelve el título de cada publicación y la cantidad de comentarios recibidos.
    return publicaciones.map(
        (publicacion: any) => ({

            titulo: publicacion.titulo,

            comentarios:
                publicacion.comentarios.length

        })
    );

}

async obtenerEstadisticasComentariosPorDia() {

    // Obtiene las publicaciones activas para analizar los comentarios.
    const publicaciones =
        await this.publicacionModel.find({
            activo: true
        });
    const estadisticas: any = {};

    for (const publicacion of publicaciones) {

        for (const comentario of publicacion.comentarios) {

            const fecha =
                new Date(comentario.fecha)
                .toLocaleDateString();

            // Si la fecha aún no existe, inicializa el contador.
            if (!estadisticas[fecha]) {

                estadisticas[fecha] = 0;

            }

            // Incrementa la cantidad de comentarios correspondientes a esa fecha.
            estadisticas[fecha]++;

        }

    }

    // Convierte el resultado en un arreglo para ser utilizado por Chart.js.
    return Object.keys(
        estadisticas
    ).map(fecha => ({

        fecha,

        cantidad:
            estadisticas[fecha]

    }));

}

}

