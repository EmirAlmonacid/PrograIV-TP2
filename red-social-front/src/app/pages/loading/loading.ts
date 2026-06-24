import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-loading',
    standalone: true,
    templateUrl: './loading.html',
    styleUrl: './loading.css'
})
export class Loading implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {

        // Obtiene el token almacenado localmente
        const token =
            localStorage.getItem('token');

        if (!token) {

            // Si no existe token, redirige
            this.router.navigate(
                ['/login']
            );

            return;

        }

        // Envía el token al backend para validar que sea válido y que no haya expirado.
        this.authService
            .autorizar(token)
            .subscribe({

                next: () => {

                    // Si el token es válido,
                    // permite ingresar a la aplicación.
                    this.router.navigate(
                        ['/publicaciones']
                    );

                },

                error: () => {

                    // Si el token es inválido o expiró, elimina la sesión localal usuario a volver a iniciar sesión.
                    localStorage.removeItem(
                        'token'
                    );

                    localStorage.removeItem(
                        'usuarioLogueado'
                    );

                    this.router.navigate(
                        ['/login']
                    );

                }

            });

    }

}