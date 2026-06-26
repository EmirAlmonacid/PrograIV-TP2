    import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { Router } from '@angular/router';

    import { Navbar } from '../../components/navbar/navbar';

    import { UsuariosService } from '../../../services/usuarios';

    import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
        } from '@angular/forms';
    

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
    selector: 'app-dashboard-usuarios',
    imports: [
        CommonModule,
        Navbar,
        ReactiveFormsModule
    ],
    templateUrl: './dashboard-usuarios.html',
    styleUrl: './dashboard-usuarios.css'
    })
    export class DashboardUsuarios implements OnInit {

    usuarios: any[] = [];

    usuarioLogueado: any;

    registroForm!: FormGroup;

    fotoSeleccionada: File | null = null;

    constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
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

        perfil: [
            'usuario',
            Validators.required
        ],

        foto: ['']

        },
        {
        validators: passwordsMatchValidator()
        });

}
    ngOnInit() {
        this.cdr.detectChanges();
        const usuario = localStorage.getItem(
        'usuarioLogueado'
        );

        if (!usuario) {

        this.router.navigate([
            '/login'
        ]);

        return;

        }

        this.usuarioLogueado =
        JSON.parse(usuario);

        if (
        this.usuarioLogueado.perfil !==
        'administrador'
        ) {

        this.router.navigate([
            '/publicaciones'
        ]);

        return;

        }

        this.cargarUsuarios();

    }

    cargarUsuarios() {
        this.cdr.detectChanges();
        this.usuariosService
        .obtenerTodos()
        .subscribe({

            next: (usuarios: any) => {

            this.usuarios = usuarios;
                this.cdr.detectChanges();
            },

            error: console.error

        });

    }

    deshabilitar(id: string) {

    this.usuariosService
        .deshabilitar(id)
        .subscribe(() => {

        this.cargarUsuarios();

        });

    }

    habilitar(id: string) {

    this.usuariosService
        .habilitar(id)
        .subscribe(() => {

        this.cargarUsuarios();

        });

    }

    seleccionarFoto(event: Event) {

    const input =
        event.target as HTMLInputElement;

    if (
        input.files &&
        input.files.length > 0
    ) {

        this.fotoSeleccionada =
            input.files[0];

    }

}
crearUsuario() {
    
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

    formData.append(
        'perfil',
        this.registroForm.value.perfil
    );

    if (this.fotoSeleccionada) {

        formData.append(
            'foto',
            this.fotoSeleccionada
        );

    }   
    console.log(formData);
    this.usuariosService
        .crear(formData)
        .subscribe({

            next: (respuesta: any) => {

    if (respuesta.error) {

        alert(respuesta.mensaje);

        return;

    }

    this.registroForm.reset();

    this.registroForm.patchValue({
        perfil: 'usuario'
    });

    this.fotoSeleccionada = null;

    this.cargarUsuarios();

},

            error: console.error

        });

}
    }