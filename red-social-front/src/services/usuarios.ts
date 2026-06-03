import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:3000/usuarios, https://progra-iv-tp-2-back-omega.vercel.app/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  crear(usuario: any) {
    return this.http.post(this.apiUrl, usuario);
  }

  login(datos: any) {
  return this.http.post(
    'http://localhost:3000/usuarios/login',
    datos
  );
}

}