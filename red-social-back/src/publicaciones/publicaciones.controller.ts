import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {

    constructor(
        private publicacionesService: PublicacionesService
    ) {}

    // Crea una nueva publicación.
    // FileInterceptor permite recibir la imagen enviada desde el frontend.
    @Post()
    @UseInterceptors(FileInterceptor('imagen'))
    crear(
        @Body() publicacion: any,
        @UploadedFile() file?: any
    ) {

        return this.publicacionesService.crear(
            publicacion,
            file
        );

    }

    // Lista publicaciones y permite ordenar y filtrar.
    @Get()
    obtenerTodas(
        @Query('orden') orden?: string,
        @Query('usuarioId') usuarioId?: string,
        @Query('offset') offset?: number,
        @Query('limit') limit?: number
    ) {

        return this.publicacionesService.obtenerTodas(
            orden,
            usuarioId,
            offset,
            limit
        );

    }

    // Elimina una publicación por id.
    @Delete(':id')
    eliminar(
        @Param('id') id: string
    ) {

        return this.publicacionesService.eliminar(id);

    }

    // Agrega un like a una publicación.
    @Post(':id/like')
    darLike(
        @Param('id') id: string,
        @Body() body: any
    ) {

        return this.publicacionesService.darLike(
            id,
            body.usuarioId
        );

    }

    // Quita el like del usuario indicado.
    @Delete(':id/like/:usuarioId')
    quitarLike(
        @Param('id') id: string,
        @Param('usuarioId') usuarioId: string
    ) {

        return this.publicacionesService.quitarLike(
            id,
            usuarioId
        );

    }

    // Agrega un comentario a la publicación seleccionada.
    @Post(':id/comentario')
    comentar(
        @Param('id') id: string,
        @Body() body: any
    ) {

        return this.publicacionesService.comentar(
            id,
            body
        );

    }

    @Post(':id/comentario/:index')
        editarComentario(
            @Param('id') id: string,
            @Param('index') index: number,
            @Body() body: any
        ) {

            return this.publicacionesService
                .editarComentario(
                    id,
                    Number(index),
                    body.texto
                );

        }

}