import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { PublicacionesService } from '../../../services/publicaciones';

@Component({
  selector: 'app-mi-perfil',
  imports: [
    CommonModule,
    Navbar
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  usuario: any = null;

  publicaciones: any[] = [];

  constructor(
    private router: Router,
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {

      this.router.navigate(['/login']);
      return;

    }

    const usuarioGuardado =
      localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {

      this.usuario =
        JSON.parse(usuarioGuardado);

      this.cargarPublicaciones();

    } else {

      this.router.navigate(['/login']);

    }

  }

  cargarPublicaciones() {

    console.log('CARGANDO PERFIL');

    this.publicacionesService
      .obtenerPublicacionesUsuario(
        this.usuario._id
      )
      .subscribe({

        next: (respuesta: any[]) => {

          console.log(respuesta);

          this.publicaciones = [...respuesta];

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

  cerrarSesion() {

    localStorage.removeItem(
      'usuarioLogueado'
    );

    localStorage.removeItem(
      'token'
    );

    this.router.navigate(['/login']);

  }

  eliminarPublicacion(id: string) {

    this.publicacionesService
      .eliminar(id)
      .subscribe({

        next: () => {

          this.publicaciones =
            this.publicaciones.filter(
              p => p._id !== id
            );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

  formatearFecha(fecha: string): string {

    return new Date(fecha)
      .toLocaleDateString('es-AR');

  }

}