import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private apiUrl =
    'https://progra-iv-tp-2-back-omega.vercel.app/publicaciones';

  constructor(
    private http: HttpClient
  ) {}

  obtenerPublicaciones(
    orden = 'fecha',
    offset = 0,
    limit = 10
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}?orden=${orden}&offset=${offset}&limit=${limit}`
    );

  }

  crear(publicacion: FormData) {

    return this.http.post(
      this.apiUrl,
      publicacion
    );

  }

  eliminar(id: string) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

  obtenerPublicacionesUsuario(
  usuarioId: string
) {

  return this.http.get<any[]>(
    `${this.apiUrl}?usuarioId=${usuarioId}&orden=fecha&offset=0&limit=3`
  );

}
  darLike(
    publicacionId: string,
    usuarioId: string
  ) {

    return this.http.post(
      `${this.apiUrl}/${publicacionId}/like`,
      { usuarioId }
    );

  }

  quitarLike(
    publicacionId: string,
    usuarioId: string
  ) {

    return this.http.delete(
      `${this.apiUrl}/${publicacionId}/like/${usuarioId}`
    );

  }

}