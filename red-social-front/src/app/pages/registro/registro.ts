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

// Valida que ambas contraseñas ingresadas sean iguales
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

// Valida que la edad esté entre 13 y 110 años
function edadValidaValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    // Ajusta la edad si todavía no cumplió años este año
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
  fotoSeleccionada: File | null = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {

    // Configuración del formulario y sus validaciones
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
          ) // Al menos 8 caracteres, una mayúscula y un número
        ]
      ],

      repetirPassword: [
        '',
        Validators.required
      ],

      fechaNacimiento: [
        '',
        [
          Validators.required,
          edadValidaValidator()
        ]
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
      // Verifica que password y repetirPassword sean iguales
      validators: passwordsMatchValidator()
    });

  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarFoto(event: Event) {

  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {

    this.fotoSeleccionada = input.files[0];

  }

}

  registrarse() {

if (this.registroForm.invalid) {
this.registroForm.markAllAsTouched();
return;
}

const formData = new FormData();

formData.append(
'nombre',
this.registroForm.value.nombre
);

formData.append(
'apellido',
this.registroForm.value.apellido
);

formData.append(
'correo',
this.registroForm.value.correo
);

formData.append(
'usuario',
this.registroForm.value.usuario
);

formData.append(
'password',
this.registroForm.value.password
);

formData.append(
'fechaNacimiento',
this.registroForm.value.fechaNacimiento
);

formData.append(
'descripcion',
this.registroForm.value.descripcion
);

if (this.fotoSeleccionada) {


formData.append(
  'foto',
  this.fotoSeleccionada
);


}

this.usuariosService.crear(formData).subscribe({
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