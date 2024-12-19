import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'pokedex', pathMatch: 'full'},
  {
    path:'pokedex',
    loadComponent: () =>
    import('./modules/poke-list/poke-list.component').then(
      m => m.PokeListComponent),
  }

];
