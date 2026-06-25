    import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { Router } from '@angular/router';

    import { Navbar } from '../../components/navbar/navbar';

    import { UsuariosService } from '../../../services/usuarios';

    @Component({
    selector: 'app-dashboard-usuarios',
    imports: [
        CommonModule,
        Navbar
    ],
    templateUrl: './dashboard-usuarios.html',
    styleUrl: './dashboard-usuarios.css'
    })
    export class DashboardUsuarios implements OnInit {

    usuarios: any[] = [];

    usuarioLogueado: any;

    constructor(

        private usuariosService: UsuariosService,
        private router: Router

    ) {}

    ngOnInit() {

        const usuario = localStorage.getItem(
        'usuarioLogueado'
        );

        if (!usuario) {

        this.router.navigate([
            '/login'
        ]);

        return;

        }

        this.usuarioLogueado =
        JSON.parse(usuario);

        if (
        this.usuarioLogueado.perfil !==
        'administrador'
        ) {

        this.router.navigate([
            '/publicaciones'
        ]);

        return;

        }

        this.cargarUsuarios();

    }

    cargarUsuarios() {

        this.usuariosService
        .obtenerTodos()
        .subscribe({

            next: (usuarios: any) => {

            this.usuarios = usuarios;

            },

            error: console.error

        });

    }

    deshabilitar(id: string) {

    this.usuariosService
        .deshabilitar(id)
        .subscribe(() => {

        this.cargarUsuarios();

        });

    }

    habilitar(id: string) {

    this.usuariosService
        .habilitar(id)
        .subscribe(() => {

        this.cargarUsuarios();

        });

    }

    }