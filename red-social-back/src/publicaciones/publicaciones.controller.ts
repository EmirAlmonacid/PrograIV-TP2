import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body
} from '@nestjs/common';

import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {

    constructor(
        private publicacionesService: PublicacionesService
    ) {}

    @Post()
    crear(
    @Body() publicacion: any
    ) {

    return this.publicacionesService.crear(
        publicacion
    );

    }

    @Get()
    obtenerTodas() {

    return this.publicacionesService.obtenerTodas();

    }

    @Delete(':id')
    eliminar(
    @Param('id') id: string
    ) {

        return this.publicacionesService.eliminar(
        id
    );

    }

}