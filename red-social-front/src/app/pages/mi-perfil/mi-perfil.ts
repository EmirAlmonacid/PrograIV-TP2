import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

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

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    const usuarioGuardado =
      localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {

      this.usuario =
        JSON.parse(usuarioGuardado);

    } else {

      this.router.navigate(['/login']);

    }

  }

  cerrarSesion() {

    localStorage.removeItem('usuarioLogueado');

    this.router.navigate(['/login']);

  }

  formatearFecha(fecha: string): string {

    return new Date(fecha)
      .toLocaleDateString('es-AR');

  }

}