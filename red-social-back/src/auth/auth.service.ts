import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {

    constructor(
    private readonly usuariosService: UsuariosService,
    ) {}

    async registro(usuario: any) {
    return this.usuariosService.crear(usuario);
    } 

    async login(
    usuario: string,
    password: string
    )  {

    return this.usuariosService.login(
        usuario,
        password
    );

    }

}