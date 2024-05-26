import { Routes } from '@angular/router';
import { petmarketroutes } from './pet-marketstore/marketstore.routes';

export const routes: Routes = [
  ...petmarketroutes,
  {
    path: 'home',
    // canActivate: [AuthGuard],
    data: { title: 'Pet store market' },
    loadChildren: () =>
      import('./pet-marketstore/pet-marketstore.component').then(
        (c) => c.PetMarketstoreComponent
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import(
        './pet-marketstore/infra/components/auth/authentication/authentication.component'
      ).then((c) => c.AuthenticationComponent),
  },
];
