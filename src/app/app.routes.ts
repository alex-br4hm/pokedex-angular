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
        path: 'pokemon/:game_index/:name',
        loadComponent: () =>
          import('./modules/poke-detail-view/poke-detail-view.component').then(
            m => m.PokeDetailViewComponent
          )
      }
    ]
  },
  {
    path: 'imprint',
    loadComponent: () =>
      import('./core/components/imprint/imprint.component').then(
        m => m.ImprintComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'pokedex',
    pathMatch: 'full'
  },

];
