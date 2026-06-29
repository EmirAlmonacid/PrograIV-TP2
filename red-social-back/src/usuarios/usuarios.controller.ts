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

  // Registra un nuevo usuario y permite cargar una foto de perfil.
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

  // Verifica las credenciales del usuario para iniciar sesión.
  @Post('login')
  login(@Body() datos: any) {

    return this.usuariosService.login(
      datos.usuario,
      datos.password
    );

  }

  // Solo un administrador puede obtener el listado completo de usuarios.
  @UseGuards(AdminGuard)
  @Get()
  obtenerTodos() {

    return this.usuariosService.obtenerTodos();

  }

  // Devuelve los últimos usuarios registrados.
  @Get('ultimos')
  obtenerUltimos() {

    return this.usuariosService.obtenerUltimos();

  }

  // Actualiza los datos del usuario
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

  // Solo un administrador puede deshabilitar
  @UseGuards(AdminGuard)
  @Delete(':id')
  deshabilitar(
    @Param('id') id: string
  ) {

    return this.usuariosService.deshabilitar(id);

  }

  // Vuelve a habilitar un usuario previamente deshabilitado.
  @Post('habilitar/:id')
  habilitar(
    @Param('id') id: string
  ) {

    return this.usuariosService.habilitar(id);

  }

}