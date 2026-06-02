import { Body, Controller, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {

  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post()
  crear(@Body() usuario: any) {
    return this.usuariosService.crear(usuario);
  }

  @Post('login')
login(@Body() datos: any) {

  return this.usuariosService.login(
    datos.usuario,
    datos.password
  );

}

}