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

  usuarioActual = 'usuario1';

  tieneLike = false;

  constructor(
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.tieneLike =
      this.likes.includes(this.usuarioActual);

  }

  darLike() {

    this.publicacionesService
      .darLike(this.id, this.usuarioActual)
      .subscribe({

        next: (respuesta: any) => {

          this.likes = [...respuesta.likes];

          this.tieneLike = true;

          this.cdr.detectChanges();

        }

      });

  }

  quitarLike() {

    this.publicacionesService
      .quitarLike(this.id, this.usuarioActual)
      .subscribe({

        next: (respuesta: any) => {

          this.likes = [...respuesta.likes];

          this.tieneLike = false;

          this.cdr.detectChanges();

        }

      });

  }

}