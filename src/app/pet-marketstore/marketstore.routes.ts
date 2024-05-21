import { Routes } from '@angular/router';

export const petmarketroutes: Routes = [
  {
    path: 'create-pet',
    loadComponent: () =>
      import('./infra/components/create-pet/create-pet.component').then(
        (c) => c.CreatePetComponent
      ),
    data: {
      title: 'Create new pet',
    },
  },
];
