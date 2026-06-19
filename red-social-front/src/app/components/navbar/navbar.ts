import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, DoCheck {

  estaLogueado = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    this.verificarSesion();

  }

  ngDoCheck(): void {

    this.verificarSesion();

  }

  verificarSesion() {

    const token =
      localStorage.getItem('token');

    this.estaLogueado = !!token;

  }

  cerrarSesion() {

    localStorage.removeItem(
      'usuarioLogueado'
    );

    localStorage.removeItem(
      'token'
    );

    this.estaLogueado = false;

    this.router.navigate(['/login']);

  }

}