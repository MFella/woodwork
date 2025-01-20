import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(module => module.HomeComponent),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./order/order.component').then(module => module.OrderComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
