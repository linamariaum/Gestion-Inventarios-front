import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/inicio' },
  { path: 'inicio', loadChildren: () => import('./pages/inicio/inicio.routes').then(m => m.INICIO_ROUTES) },
  { path: 'categorias', loadChildren: () => import('./pages/categoria/categoria.routes').then(m => m.CATEGORIA_ROUTES) },
  { path: 'productos', loadChildren: () => import('./pages/producto/producto.routes').then(m => m.PRODUCTOS_ROUTES) },
  { path: 'clientes', loadChildren: () => import('./pages/cliente/cliente.routes').then(m => m.CLIENTE_ROUTES) }
];
