import { Routes } from '@angular/router';

export const petmarketroutes: Routes = [
  {
    path: 'market',
    loadComponent: () =>
      import('./infra/components/market/market.component').then(
        (c) => c.MarketComponent
      ),
    data: {
      title: 'Create new pet',
    },
  },
];
