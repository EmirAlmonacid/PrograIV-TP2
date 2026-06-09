import { Component } from '@angular/core';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  templateUrl: './publicacion-card.html',
  styleUrls: ['./publicacion-card.css']
})
export class PublicacionCard {

  titulo = 'Mi primera publicación';

  descripcion = 'Probando Angular y MongoDB';

  imagen = 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200';

  likes = 15;

}