import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsuariosService } from './usuarios.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('usuarios')
export class UsuariosController {

  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  
  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  crear(
    @Body() usuario: any,
    @UploadedFile() file?: any,
  ) {

    return this.usuariosService.crear(
      usuario,
      file
    );

  }

  @Post('login')
  login(@Body() datos: any) {

    return this.usuariosService.login(
      datos.usuario,
      datos.password
    );

  }

  @UseGuards(AdminGuard)
  @Get()
  obtenerTodos() {

    return this.usuariosService.obtenerTodos();

  }

  @Get('ultimos')
  obtenerUltimos() {

    return this.usuariosService.obtenerUltimos();

  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('foto')
  )
  actualizar(
    @Param('id') id: string,
    @Body() datos: any,
    @UploadedFile() foto?: any
  ) {

    return this.usuariosService.actualizar(
      id,
      datos,
      foto
    );

  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deshabilitar(
    @Param('id') id: string
  ) {

    return this.usuariosService.deshabilitar(id);

  }

  @Post('habilitar/:id')
  habilitar(
    @Param('id') id: string
  ) {

    return this.usuariosService.habilitar(id);

  }

}