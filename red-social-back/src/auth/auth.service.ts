import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    async registro(usuario: any) {

        return this.usuariosService.crear(usuario);

    }

    async login(
        usuario: string,
        password: string
    ) {

        const usuarioEncontrado =
            await this.usuariosService.login(
                usuario,
                password
            );

        if (!usuarioEncontrado) {
            return null;
        }

        const payload = {
            id: (usuarioEncontrado as any)._id,
            usuario: usuarioEncontrado.usuario,
            perfil: usuarioEncontrado.perfil
        };

        const token =
            this.jwtService.sign(payload);

        return {
            token,
            usuario: usuarioEncontrado
        };

    }

}