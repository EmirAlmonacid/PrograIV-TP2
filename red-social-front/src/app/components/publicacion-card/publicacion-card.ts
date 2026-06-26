import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PublicacionesService } from '../../../services/publicaciones';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css']
})
export class PublicacionCard implements OnInit {

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
  fecha!: string;

  @Input()
  comentarios: any[] = [];

  usuarioActual = '';

  esAdministrador = false;

  tieneLike = false;

  nuevoComentario = '';

  comentarioEditando: number | null = null;

  textoEditado = '';

  comentariosVisibles = 3;

  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

      // Obtiene el usuario logueado y verifica
      // si ya dio like a la publicación.
      const usuario =
    JSON.parse(
      localStorage.getItem(
        'usuarioLogueado'
      ) || '{}'
    );

  this.usuarioActual =
    usuario._id;

  this.esAdministrador =
    usuario.perfil ===
    'administrador';

  this.tieneLike =
    this.likes.includes(
      this.usuarioActual
    );

  }

  darLike() {

    // Agrega un like a la publicación
    // realizada por el usuario actual.
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

    // Elimina el like previamente
    // realizado por el usuario.
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

    // Elimina la publicación seleccionada
    // y actualiza la lista recargando la vista.
    this.publicacionesService
      .eliminar(this.id)
      .subscribe({

        next: () => {

          window.location.reload();

        },

        error: (error) => {

          console.log(error);

        }

      });

  }


  agregarComentario() {

    // Crea un nuevo comentario asociado
    // al usuario actualmente logueado.
    this.cdr.detectChanges();

    const usuario =
      JSON.parse(
        localStorage.getItem(
          'usuarioLogueado'
        ) || '{}'
      );

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

          this.comentarios =
            [...respuesta.comentarios];

          this.nuevoComentario = '';

          this.cdr.detectChanges();

        }

      });

  }

  editarComentario(
    index: number,
    texto: string
  ) {

    // Habilita el modo edición para
    // el comentario seleccionado.
    this.comentarioEditando =
      index;

    this.textoEditado =
      texto;

  }

  guardarComentario(
    index: number
  ) {

    // Guarda los cambios realizados
    // sobre un comentario existente.
    this.publicacionesService
      .editarComentario(
        this.id,
        index,
        this.textoEditado
      )
      .subscribe({

        next: (respuesta: any) => {

          this.comentarios =
            [...respuesta.comentarios];

          this.comentarioEditando =
            null;

          this.textoEditado = '';

          this.cdr.detectChanges();

        }

      });

  }

  cargarMasComentarios() {

    // Incrementa la cantidad de comentarios
    // visibles en grupos de tres.
    this.comentariosVisibles += 3;

  }

}

