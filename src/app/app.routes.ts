import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full'},
  {
    path:'pokedex',
    loadComponent: () =>
    import('./modules/poke-list/poke-list.component').then(
      m => m.PokeListComponent
    ),
    children: [
      {
        path: 'pokemon/:game_index',
        loadComponent: () =>
          import('./modules/poke-detail-view/poke-detail-view.component').then(
            m => m.PokeDetailViewComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'pokedex',
    pathMatch: 'full'},

];
