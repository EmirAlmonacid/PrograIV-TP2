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

    async obtenerTodas() {

        return await this.publicacionModel
        .find({
        activo: true
        })
        .sort({
        fechaCreacion: -1
        });

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

}