import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl =
    'https://progra-iv-tp-2-back-omega.vercel.app/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  crear(usuario: any) {

    return this.http.post(
      this.apiUrl,
      usuario
    );

  }

  login(datos: any) {

    return this.http.post(
      'https://progra-iv-tp-2-back-omega.vercel.app/auth/login',
      datos
    );

  }

  obtenerTodos() {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }

  obtenerUltimosUsuarios() {

    return this.http.get<any[]>(
      'https://progra-iv-tp-2-back-omega.vercel.app/usuarios/ultimos'
    );

  }

  actualizar(
    id: string,
    datos: FormData
  ) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      datos
    );

  }

  deshabilitar(
    id: string
  ) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

  habilitar(
    id: string
  ) {

    return this.http.post(
      `${this.apiUrl}/habilitar/${id}`,
      {}
    );

  }

}