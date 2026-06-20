import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Router } from '@angular/router';

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
    private cdr: ChangeDetectorRef
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

  let segundos = 0;

  const contador =
    setInterval(() => {

      segundos++;

      console.log(
        'SEGUNDOS:',
        segundos
      );

    }, 1000);

  this.temporizadorSesion =
    setTimeout(() => {

      clearInterval(
        contador
      );

      console.log(
        'MOSTRANDO MODAL'
      );

      this.mostrarModalSesion =
        true;
      
      this.cdr.detectChanges();

    }, 5000);

}

  extenderSesion() {

    this.mostrarModalSesion =
      false;

    this.cdr.detectChanges();

    this.iniciarContador();

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