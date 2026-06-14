import { Component, OnInit } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';

import { PublicacionesService } from '../../../services/publicaciones';

import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [
    Navbar,
    PublicacionCard,
    FormsModule
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

  constructor(
    private publicacionesService:
    PublicacionesService
  ) {}

  ngOnInit() {

    this.cargarPublicaciones();

  }

  abrirModal() {

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

  console.log('ENTRO CREAR');

  console.log(this.titulo);

  console.log(this.descripcion);

  console.log(this.imagenSeleccionada);

  const formData = new FormData();

  formData.append(
    'titulo',
    this.titulo
  );

  formData.append(
    'descripcion',
    this.descripcion
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

      next: (respuesta) => {

        console.log('OK');

        console.log(respuesta);

      },

      error: (error) => {

        console.log('ERROR');

        console.log(error);

      }

    });

}

  cargarPublicaciones() {

    this.publicacionesService
    .obtenerPublicaciones(
      this.orden,
      this.offset,
      this.limit
    )
    .subscribe({

      next: (respuesta: any[]) => {

        this.publicaciones = respuesta;

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

}