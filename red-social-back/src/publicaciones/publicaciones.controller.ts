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

    // Crea una nueva publicación y recibe una imagen si fue enviada.
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

    // Obtiene estadísticas de publicaciones por usuario.
    @Get('estadisticas/publicaciones')
    obtenerEstadisticasPublicaciones() {

        return this.publicacionesService
            .obtenerEstadisticasPublicaciones();

    }

    // Obtiene la cantidad de comentarios por publicación.
    @Get('estadisticas/comentarios')
    obtenerEstadisticasComentarios() {

        return this.publicacionesService
            .obtenerEstadisticasComentarios();

    }

    // Obtiene la cantidad de comentarios realizados por día.
    @Get('estadisticas/comentarios-dia')
    obtenerEstadisticasComentariosPorDia() {

        return this.publicacionesService
            .obtenerEstadisticasComentariosPorDia();

    }

    // Obtiene publicaciones aplicando filtros, orden y paginación.
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

    // Deshabilita una publicación mediante baja lógica.
    @Delete(':id')
    eliminar(
        @Param('id') id: string
    ) {

        return this.publicacionesService.eliminar(id);

    }

    // Registra un nuevo like del usuario sobre la publicación.
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

    // Elimina el like realizado por el usuario.
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

    // Agrega un comentario a una publicación.
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

    // Actualiza el contenido de un comentario existente.
    @Post(':id/comentario/:index')
    editarComentario(
        @Param('id') id: string,
        @Param('index') index: number,
        @Body() body: any
    ) {

        return this.publicacionesService.editarComentario(
            id,
            Number(index),
            body.texto
        );

    }

    // Devuelve los comentarios de una publicación con paginación.
    @Get(':id/comentarios')
    obtenerComentarios(
        @Param('id') id: string,
        @Query('offset') offset?: number,
        @Query('limit') limit?: number
    ) {

        return this.publicacionesService.obtenerComentarios(
            id,
            offset,
            limit
        );

    }

}