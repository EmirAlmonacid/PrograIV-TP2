import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Publicacion {

    @Prop({
    required: true,
    maxlength: 100
    })
    titulo!: string;

    @Prop({
    required: true,
    maxlength: 500
    })
    descripcion!: string;

    @Prop()
    imagen!: string;

    @Prop({
    required: true
    })
    usuarioId!: string;

    @Prop({
    default: []
    })
    likes!: string[];

    @Prop({
    default: true
    })
    activo!: boolean;

    @Prop({
    default: Date.now
    })
    fechaCreacion!: Date;

    @Prop({
        default: []
        })
        comentarios!: {
        usuarioId: string;
        usuario: string;
        texto: string;
        fecha: Date;
        }[];

}

export const PublicacionSchema =
    SchemaFactory.createForClass(Publicacion);