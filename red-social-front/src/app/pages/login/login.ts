import { Component } from '@angular/core';
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
    ReactiveFormsModule
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
    private router: Router
  ) {

    // Configuración del formulario de inicio de sesión
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  iniciarSesion() {

    // Si hay campos inválidos, muestra los errores
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Envía las credenciales al servicio
    this.usuariosService.login({
      usuario: this.loginForm.value.usuario,
      password: this.loginForm.value.password
    })
    .subscribe({

      next: (usuario: any) => {

        // Verifica si el usuario existe
        if (!usuario) {

          this.mensajeModal =
            'Usuario o contraseña incorrectos';

          this.mostrarModal = true;

          return;

        }

        // Guarda la sesión del usuario
        localStorage.setItem(
          'usuarioLogueado',
          JSON.stringify(usuario)
        );

        this.mensajeModal =
          'Inicio de sesión exitoso';

        this.mostrarModal = true;

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

    // Redirige al usuario luego de iniciar sesión
    if (this.mensajeModal === 'Inicio de sesión exitoso') {
      this.router.navigate(['/publicaciones']);
    }

  }

}