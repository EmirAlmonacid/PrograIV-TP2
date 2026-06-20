import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-login',
  imports: [
    Navbar,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  mostrarModal = false;
  mensajeModal = "";

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  iniciarSesion() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();
      return;

    }

    this.usuariosService.login({
      usuario: this.loginForm.value.usuario,
      password: this.loginForm.value.password
    })
    .subscribe({

      next: (respuesta: any) => {

        if (!respuesta) {

          this.mensajeModal =
            'Usuario o contraseña incorrectos';

          this.mostrarModal = true;

          this.cdr.detectChanges();
          return;

        }

        localStorage.setItem(
          'token',
          respuesta.token
        );

        localStorage.setItem(
          'usuarioLogueado',
          JSON.stringify(respuesta.usuario)
        );

        this.mensajeModal =
          'Inicio de sesión exitoso';

        this.mostrarModal = true;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(error);

        this.mensajeModal =
          'Error al iniciar sesión';

        this.mostrarModal = true;

      }

    });

  }

  cerrarModal() {

    this.mostrarModal = false;

    if (
      this.mensajeModal ===
      'Inicio de sesión exitoso'
    ) {
      window.dispatchEvent(
      new Event('loginExitoso')
      );
      this.router.navigate([
        '/publicaciones'
      ]);

    }

  }

}