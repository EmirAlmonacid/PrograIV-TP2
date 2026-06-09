import { Component, OnInit } from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';

import { PublicacionesService } from '../../../services/publicaciones';

import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [
    Navbar,
    PublicacionCard
  ],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones implements OnInit {

  publicaciones: any[] = [];

  orden = 'fecha';

  offset = 0;

  limit = 5;

  constructor(
    private publicacionesService:
    PublicacionesService
  ) {}

  ngOnInit() {

    this.cargarPublicaciones();

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