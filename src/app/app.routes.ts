import { Routes } from '@angular/router';
import { petmarketroutes } from './pet-marketstore/marketstore.routes';

export const routes: Routes = [
  ...petmarketroutes,
  {
    path: 'home',
    data: { title: 'Pet store market' },
    loadChildren: () =>
      import('./pet-marketstore/pet-marketstore.component').then(
        (c) => c.PetMarketstoreComponent
      ),
  },
];
