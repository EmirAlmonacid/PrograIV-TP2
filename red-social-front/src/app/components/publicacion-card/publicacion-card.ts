import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css']
})
export class PublicacionCard {

  @Input()
  titulo!: string;

  @Input()
  descripcion!: string;

  @Input()
  imagen!: string;

  @Input()
  likes!: string[];

}