import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title =
    signal('red-social-front');

  mostrarModalSesion = false;

  temporizadorSesion: any;

  segundosRestantes = 20;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    

)  {}

      ngOnInit() {
        window.addEventListener(
          'logout',
          () => {

            clearTimeout(
              this.temporizadorSesion
            );

            this.mostrarModalSesion =
              false;

          }
        );
      const token =
        localStorage.getItem('token');

      if (token) {

        this.iniciarContador();

      }

      window.addEventListener(
        'loginExitoso',
        () => {

          this.iniciarContador();

        }
      );

    }

  iniciarContador() {

  clearTimeout(
    this.temporizadorSesion
  );

  this.segundosRestantes = 10;
  this.segundosRestantes = 20;

  localStorage.setItem(
    'segundosRestantes',
    this.segundosRestantes.toString()
  );
  const contador =
    setInterval(() => {

      this.segundosRestantes--;

      localStorage.setItem(
        'segundosRestantes',
        this.segundosRestantes.toString()
      );

      if (
        this.segundosRestantes <= 0
      ) {

        clearInterval(
          contador
        );

      }

    }, 1000);

  this.temporizadorSesion =
    setTimeout(() => {

      clearInterval(
        contador
      );

      this.mostrarModalSesion =
        true;

      this.cdr.detectChanges();

    }, 20000);

}

  extenderSesion() {

  const token =
    localStorage.getItem('token');

  if (!token) {
    return;
  }

  this.authService
    .refrescar(token)
    .subscribe({

      next: (respuesta: any) => {

        localStorage.setItem(
          'token',
          respuesta.token
        );

        this.mostrarModalSesion =
          false;

        this.iniciarContador();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.log(error);

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'usuarioLogueado'
        );

        this.router.navigate([
          '/login'
        ]);

      }

    });

}

  cerrarSesionPorVencimiento() {

    clearTimeout(
      this.temporizadorSesion
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'usuarioLogueado'
    );

    this.mostrarModalSesion =
      false;

    this.router.navigate([
      '/login'
    ]);

  }

}