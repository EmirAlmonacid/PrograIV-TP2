import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { PublicacionesService } from '../../../services/publicaciones';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
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

  usuarioActual = '';

  tieneLike = false;

  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

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

}