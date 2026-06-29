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


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {

    // Detiene el contador cuando el usuario cierra sesión.
    window.addEventListener(
      'logout',
      () => {

        clearInterval(
        this.temporizadorSesion
      );

        this.mostrarModalSesion =
          false;

      }
    );

    const token =
      localStorage.getItem('token');

    // Si existe un token válido, inicia el contador.
    if (token) {

      this.iniciarContador();

    }

    // Reinicia el contador luego de un inicio de sesión.
    window.addEventListener(
      'loginExitoso',
      () => {

        this.iniciarContador();

      }
    );

  }

 iniciarContador() {

  clearInterval(
    this.temporizadorSesion
  );

  this.temporizadorSesion =
    setInterval(() => {

      const expiracion =
        Number(
          localStorage.getItem(
            'expiracionToken'
          )
        );

      const segundosRestantes =
        Math.floor(
          (expiracion - Date.now()) / 1000
        );

      if (
        segundosRestantes <= 0
      ) {

        clearInterval(
          this.temporizadorSesion
        );

        this.mostrarModalSesion =
          true;

        this.cdr.detectChanges();

      }

    }, 1000);

}


  extenderSesion() {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    // Solicita un nuevo JWT para extender la sesión.
    this.authService
      .refrescar(token)
      .subscribe({

        next: (respuesta: any) => {

          localStorage.setItem(
            'token',
            respuesta.token
          );

          const expiracion =
          Date.now() + 10 * 60 * 1000;

        localStorage.setItem(
          'expiracionToken',
          expiracion.toString()
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
    localStorage.removeItem(
  'expiracionToken'
);
    clearInterval(
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

