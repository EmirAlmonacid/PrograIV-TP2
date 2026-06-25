    import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
    } from '@nestjs/common';

    import { JwtService } from '@nestjs/jwt';

    @Injectable()
    export class AdminGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean {

        const request =
        context
            .switchToHttp()
            .getRequest();

        const authorization =
        request.headers.authorization;

        if (!authorization) {

        throw new UnauthorizedException(
            'Token requerido'
        );

        }

        const token =
        authorization.replace(
            'Bearer ',
            ''
        );

       try {

  console.log('TOKEN RECIBIDO:');
  console.log(token);

  const payload =
    this.jwtService.verify(token);

  console.log('PAYLOAD:');
  console.log(payload);

  if (
    payload.perfil !==
    'administrador'
  ) {

    throw new UnauthorizedException(
      'No autorizado'
    );

  }

  request.usuario = payload;

  return true;

} catch (error) {

  console.log('ERROR VERIFY:');
  console.log(error);

  throw new UnauthorizedException(
    'Token inválido'
  );

}}

    }