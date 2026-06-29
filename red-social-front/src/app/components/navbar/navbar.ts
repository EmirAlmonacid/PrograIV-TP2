import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DeshabilitadoVisualDirective } from '../../directives/deshabilitado-visual.directive';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    DeshabilitadoVisualDirective
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, DoCheck {

  estaLogueado = false;

  esAdministrador = false;

  tiempoRestante = '00:00';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.verificarSesion();

    setInterval(() => {

      const expiracion =
        Number(
          localStorage.getItem(
            'expiracionToken'
          )
        );

      const segundos =
        Math.max(
          0,
          Math.floor(
            (expiracion - Date.now()) / 1000
          )
        );

      const minutos =
        Math.floor(segundos / 60);

      const resto =
        segundos % 60;

      this.tiempoRestante =
        `${minutos
          .toString()
          .padStart(2, '0')}:${resto
          .toString()
          .padStart(2, '0')}`;

      this.cdr.detectChanges();

    }, 1000);

  }

  ngDoCheck(): void {

    this.verificarSesion();

  }

  verificarSesion() {

    const token =
      localStorage.getItem('token');

    this.estaLogueado = !!token;

    const usuario =
      localStorage.getItem(
        'usuarioLogueado'
      );

    if (usuario) {

      this.esAdministrador =
        JSON.parse(usuario).perfil ===
        'administrador';

    } else {

      this.esAdministrador = false;

    }

  }

  cerrarSesion() {

    localStorage.removeItem(
      'usuarioLogueado'
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'expiracionToken'
    );

    window.dispatchEvent(
      new Event('logout')
    );

    this.estaLogueado = false;

    this.router.navigate([
      '/login'
    ]);

  }

}