import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  {
    path: 'catalog',
    loadComponent: () => loadRemoteModule('catalog', './Component').then((m) => m.App),
  },
  {
    path: 'cart',
    loadComponent: () => loadRemoteModule('cart', './Component').then((m) => m.App),
  },
];
