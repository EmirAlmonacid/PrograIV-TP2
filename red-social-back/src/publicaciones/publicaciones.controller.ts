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

    @Delete(':id')
    eliminar(
        @Param('id') id: string
    ) {

        return this.publicacionesService.eliminar(id);

    }

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

}