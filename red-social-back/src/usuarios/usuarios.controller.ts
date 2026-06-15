import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';

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
    return this.usuariosService.crear(usuario, file);
  }

  @Post('login')
  login(@Body() datos: any) {

    return this.usuariosService.login(
      datos.usuario,
      datos.password
    );

  }

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get('ultimos')
obtenerUltimos() {

  return this.usuariosService.obtenerUltimos();

}
}