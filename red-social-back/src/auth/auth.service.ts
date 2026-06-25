import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    async registro(usuario: any) {

        // Delega la creación del usuario
        // al módulo de usuarios.
        return this.usuariosService.crear(usuario);

    }

    async login(
        usuario: string,
        password: string
    ) {

        // Verifica que el usuario y la contraseña sean correctos.
        const usuarioEncontrado =
            await this.usuariosService.login(
                usuario,
                password
            );

        if (!usuarioEncontrado) {
            return null;
        }

        if ((usuarioEncontrado as any).error) {
            return usuarioEncontrado;
        }

        // Información que quedará almacenada dentro del JWT para identificar al usuario.
                const payload = {
            id: (usuarioEncontrado as any)._id,
            usuario: (usuarioEncontrado as any).usuario,
            perfil: (usuarioEncontrado as any).perfil
        };

        // Genera el token utilizando la clave configurada en JwtModule y el tiempo de
        const token =
            this.jwtService.sign(payload);

        // Devuelve el token junto con los datos del usuario al frontend.
        return {
            token,
            usuario: usuarioEncontrado
        };

    }

    async autorizar(token: string) {

        try {

            // Verifica que el token sea válido,
            const payload =
                this.jwtService.verify(token);

            // Si la validación es correcta, devuelve la información del usuario.
            return payload;

        } catch {

            // Si ocurre cualquier error durante la validación, responde con HTTP 401.
            throw new UnauthorizedException(
                'Token inválido o vencido'
            );

        }

    }

    async refrescar(token: string) {

        try {

            // Primero valida que el token actual continúe siendo válido.
            const payload =
                this.jwtService.verify(token);

            // Conserva la misma información del usuario para generar un nuevo JWT.
            const nuevoPayload = {
                id: payload.id,
                usuario: payload.usuario,
                perfil: payload.perfil
            };

            // Genera un nuevo token con un nuevo tiempo de expiración.
            const nuevoToken =
                this.jwtService.sign(nuevoPayload);

            return {
                token: nuevoToken
            };

        } catch {

            // Si el token ya expiró o es inválido, no es posible renovarlo.
            throw new UnauthorizedException(
                'Token inválido o vencido'
            );

        }

    }

}