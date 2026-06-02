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

    next: (usuario: any) => {

      if (!usuario) {

        this.mensajeModal =
          'Usuario o contraseña incorrectos';

        this.mostrarModal = true;

        return;

      }

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

  if (this.mensajeModal === 'Inicio de sesión exitoso') {
    this.router.navigate(['/publicaciones']);
  }

}

}



