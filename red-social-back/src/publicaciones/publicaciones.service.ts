import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Publicacion } from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {

    constructor(
        @InjectModel(Publicacion.name)
        private publicacionModel: Model<Publicacion>
    ) {}

    async crear(publicacion: any) {

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

        if (usuarioId) {
            filtro.usuarioId = usuarioId;
        }

        const criterioOrden =
            orden === 'likes'
                ? { likes: -1 }
                : { fechaCreacion: -1 };

        return await this.publicacionModel
            .find(filtro)
            .sort(criterioOrden as any)
            .skip(Number(offset))
            .limit(Number(limit));

    }

    async eliminar(id: string) {

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

}