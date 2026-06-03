import { Component } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

function passwordsMatchValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const password = control.get('password');
    const repetirPassword = control.get('repetirPassword');

    if (!password || !repetirPassword) {
      return null;
    }

    return password.value === repetirPassword.value
      ? null
      : { passwordsMismatch: true };

  };

}

function edadValidaValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }

    if (edad < 13) {
      return { menorDeEdad: true };
    }

    if (edad > 110) {
      return { edadInvalida: true };
    }

    return null;

  };

}

@Component({
  selector: 'app-registro',
  imports: [
    Navbar,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  registroForm: FormGroup;
  mostrarModal = false;
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {

    this.registroForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
        ]
      ],

      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
        ]
      ],

      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      ],

      usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d).{8,}$/
          )
        ]
      ],

      repetirPassword: [
        '',
        Validators.required
      ],

      fechaNacimiento: [
        '',[
        Validators.required,
        edadValidaValidator()]
      ],

      descripcion: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      foto: ['']

    },
    {
      validators: passwordsMatchValidator()
    });

  }

  cerrarModal() {
  this.mostrarModal = false;
}
  registrarse() {

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const usuario = {
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      correo: this.registroForm.value.correo,
      usuario: this.registroForm.value.usuario,
      password: this.registroForm.value.password,
      fechaNacimiento: this.registroForm.value.fechaNacimiento,
      descripcion: this.registroForm.value.descripcion,
      foto: this.registroForm.value.foto
    };

    this.usuariosService.crear(usuario).subscribe({
      next: (respuesta) => {

        console.log('Usuario creado', respuesta);

        this.mostrarModal = true;

      },
      error: (error) => {

    console.error(error);

      }
    });

  }

}