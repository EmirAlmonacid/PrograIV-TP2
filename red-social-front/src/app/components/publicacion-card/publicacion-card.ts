import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PublicacionesService } from '../../../services/publicaciones';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css']
})
export class PublicacionCard implements OnInit {

  // Datos que recibe desde el componente Publicaciones
  @Input()
  id!: string;

  @Input()
  titulo!: string;

  @Input()
  descripcion!: string;

  @Input()
  imagen!: string;

  @Input()
  likes!: string[];

  @Input()
  usuarioId!: string;

  @Input()
  comentarios: any[] = [];

  usuarioActual = '';

  tieneLike = false;

  nuevoComentario = '';

  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  // Obtiene el usuario logueado y verifica si ya dio like
  ngOnInit() {

    const usuario =
      JSON.parse(
        localStorage.getItem(
          'usuarioLogueado'
        ) || '{}'
      );

    this.usuarioActual =
      usuario._id;

    this.tieneLike =
      this.likes.includes(
        this.usuarioActual
      );

  }

  darLike() {

    const usuario =
      JSON.parse(
        localStorage.getItem(
          'usuarioLogueado'
        ) || '{}'
      );

    if (!usuario._id) {
      return;
    }

    this.publicacionesService
      .darLike(
        this.id,
        usuario._id
      )
      .subscribe({

        next: (respuesta: any) => {

          this.likes =
            [...respuesta.likes];

          this.tieneLike = true;

          this.cdr.detectChanges();

        }

      });

  }

  quitarLike() {

    const usuario =
      JSON.parse(
        localStorage.getItem(
          'usuarioLogueado'
        ) || '{}'
      );

    if (!usuario._id) {
      return;
    }

    this.publicacionesService
      .quitarLike(
        this.id,
        usuario._id
      )
      .subscribe({

        next: (respuesta: any) => {

          this.likes =
            [...respuesta.likes];

          this.tieneLike = false;

          this.cdr.detectChanges();

        }

      });

  }

  eliminarPublicacion() {

    this.publicacionesService
      .eliminar(this.id)
      .subscribe({

        // Si se elimina correctamente, recarga la vista
        next: () => {

          window.location.reload();

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

  agregarComentario() {

    this.cdr.detectChanges();

    const usuario =
      JSON.parse(
        localStorage.getItem(
          'usuarioLogueado'
        ) || '{}'
      );

    // Evita comentarios vacíos o usuarios sin sesión iniciada
    if (
      !usuario._id ||
      !this.nuevoComentario.trim()
    ) {
      return;
    }

    this.publicacionesService
      .comentar(
        this.id,
        {
          usuarioId: usuario._id,
          usuario: usuario.usuario,
          texto: this.nuevoComentario
        }
      )
      .subscribe({

        next: (respuesta: any) => {

          // Actualiza la lista de comentarios con la respuesta del backend
          this.comentarios =
            [...respuesta.comentarios];

          this.nuevoComentario = '';

          this.cdr.detectChanges();

        }

      });

  }

}

