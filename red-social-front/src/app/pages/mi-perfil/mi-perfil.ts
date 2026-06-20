import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { PublicacionesService } from '../../../services/publicaciones';
import { UsuariosService } from '../../../services/usuarios';

@Component({
  selector: 'app-mi-perfil',
  imports: [
    CommonModule,
    Navbar,
    FormsModule
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  usuario: any = null;

  publicaciones: any[] = [];

  modoEdicion = false;

  fotoSeleccionada:
  File | null = null;

  constructor(
    private router: Router,
    private publicacionesService: PublicacionesService,
    private usuariosService: UsuariosService,
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

    this.publicacionesService
      .obtenerPublicacionesUsuario(
        this.usuario._id
      )
      .subscribe({

        next: (respuesta: any[]) => {

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

      window.dispatchEvent(
        new Event('logout')
      );

        this.router.navigate([
          '/login'
        ]);

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

  editarPerfil() {

    this.modoEdicion = true;

  }

  seleccionarFoto(event: Event) {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.fotoSeleccionada =
        input.files[0];

    }

  }

  guardarPerfil() {

    const formData =
      new FormData();

    formData.append(
      'nombre',
      this.usuario.nombre
    );

    formData.append(
      'apellido',
      this.usuario.apellido
    );

    formData.append(
      'descripcion',
      this.usuario.descripcion
    );

    formData.append(
      'fechaNacimiento',
      this.usuario.fechaNacimiento
    );

    if (this.fotoSeleccionada) {

      formData.append(
        'foto',
        this.fotoSeleccionada
      );

    }

    this.usuariosService
      .actualizar(
        this.usuario._id,
        formData
      )
      .subscribe({

        next: (usuarioActualizado: any) => {

          this.usuario =
            usuarioActualizado;

          localStorage.setItem(
            'usuarioLogueado',
            JSON.stringify(
              usuarioActualizado
            )
          );

          this.modoEdicion = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

}