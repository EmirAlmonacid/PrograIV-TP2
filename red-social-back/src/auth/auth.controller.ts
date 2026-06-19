import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('registro')
    registro(@Body() usuario: any) {

        return this.authService.registro(usuario);

    }

    @Post('login')
    login(@Body() datos: any) {

        return this.authService.login(
            datos.usuario,
            datos.password
        );

    }

    @Post('autorizar')
    autorizar(@Body() datos: any) {

        return this.authService.autorizar(
            datos.token
        );

    }

}