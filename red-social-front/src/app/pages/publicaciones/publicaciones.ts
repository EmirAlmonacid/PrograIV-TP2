import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';

import { PublicacionesService } from '../../../services/publicaciones';

import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { UsuariosService } from '../../../services/usuarios';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [
    Navbar,
    PublicacionCard,
    FormsModule,
  ],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones implements OnInit {

  publicaciones: any[] = [];

  orden = 'fecha';

  offset = 0;

  limit = 5;

  mostrarModal = false;

  titulo = '';

  descripcion = '';

  imagenSeleccionada: File | null = null;

  usuariosRecientes: any[] = [];

  constructor(
    private publicacionesService:
    PublicacionesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private usuariosService: UsuariosService,
  ) {}

  ngOnInit() {
      console.log('INICIO');

    this.cargarPublicaciones();

    this.cargarUsuarios();


  }

  abrirModal() {

  const usuario =
    localStorage.getItem(
      'usuarioLogueado'
    );

  if (!usuario) {

    this.router.navigate([
      '/login'
    ]);

    return;

  }

  this.mostrarModal = true;

}

  cerrarModal() {

    this.mostrarModal = false;

    this.titulo = '';

    this.descripcion = '';

    this.imagenSeleccionada = null;

  }

  seleccionarImagen(event: Event) {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.imagenSeleccionada =
        input.files[0];

    }

  }

  crearPublicacion() {
    console.log(localStorage.getItem('usuarioLogueado'));
  const usuario =
    JSON.parse(
      localStorage.getItem('usuarioLogueado') || '{}'
    );

  const formData = new FormData();

  formData.append(
    'titulo',
    this.titulo
  );

  formData.append(
    'descripcion',
    this.descripcion
  );

  formData.append(
    'usuarioId',
    usuario._id
  );

  if (this.imagenSeleccionada) {

    formData.append(
      'imagen',
      this.imagenSeleccionada
    );

  }

  this.publicacionesService
    .crear(formData)
    .subscribe({

      next: () => {

        this.cerrarModal();

        this.cargarPublicaciones();

        this.cargarUsuarios();

        this.cdr.detectChanges();


      },

      error: (error) => {

        console.log(error);

      }

    });

}

  cargarPublicaciones() {

  console.log('CARGANDO');

  this.publicacionesService
    .obtenerPublicaciones(
      this.orden,
      this.offset,
      this.limit
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

  ordenarPorFecha() {

    this.orden = 'fecha';

    this.cargarPublicaciones();

  }

  ordenarPorLikes() {

    this.orden = 'likes';

    this.cargarPublicaciones();

  }

  cargarUsuarios() {

  this.usuariosService
    .obtenerUltimosUsuarios()
    .subscribe({

      next: (respuesta: any[]) => {

        this.usuariosRecientes = respuesta;

      }

    });

}

}