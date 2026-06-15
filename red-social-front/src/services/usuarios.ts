import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'https://progra-iv-tp-2-back-omega.vercel.app/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  crear(usuario: any) {
    return this.http.post(this.apiUrl, usuario);
  }

  login(datos: any) {
    return this.http.post(
      'https://progra-iv-tp-2-back-omega.vercel.app/usuarios/login',
      datos
    );
  }

  obtenerUltimosUsuarios() {

  return this.http.get<any[]>(
    'https://progra-iv-tp-2-back-omega.vercel.app/usuarios/ultimos'
  );

}

}