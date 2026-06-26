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

  segundosRestantes = 600;

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

        clearTimeout(
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

    clearTimeout(
      this.temporizadorSesion
    );

    const tiempoGuardado =
      Number(
        localStorage.getItem(
          'segundosRestantes'
        )
      );

    this.segundosRestantes =
      tiempoGuardado > 0
        ? tiempoGuardado
        : 600;

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

    // Al finalizar el tiempo muestra el modal de renovación.
    this.temporizadorSesion =
      setTimeout(() => {

        clearInterval(
          contador
        );

        this.mostrarModalSesion =
          true;

        this.cdr.detectChanges();

      }, 600000);

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

