import { Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: 'loading',
  loadComponent: () =>
    import('./pages/loading/loading')
      .then(m => m.Loading)
},

  {
    
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro')
        .then(m => m.Registro)
  },
  {
    path: 'publicaciones',
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones')
        .then(m => m.Publicaciones)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/mi-perfil/mi-perfil')
        .then(m => m.MiPerfil)
  },
  {
  path: '',
  redirectTo: 'loading',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: 'loading'
}
];