import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {PokeDataService} from "../../core/services/poke-data.service";
import {Pokemon} from '../../core/models/pokemon';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {StatsComponent} from './stats/stats.component';
import {FirebaseService} from '../../core/services/firebase.service';
import {VariousInformationComponent} from './various-information/various-information.component';
import {EvolutionChainComponent} from './evolution-chain/evolution-chain.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-poke-detail-view',
  imports: [
    RouterLink,
    MatIcon,
    CustomLoadingSpinnerComponent,
    StatsComponent,
    VariousInformationComponent,
    EvolutionChainComponent
  ],
  templateUrl: './poke-detail-view.component.html',
  styleUrl: './poke-detail-view.component.scss'
})
export class PokeDetailViewComponent implements OnInit {
  pokemon: Pokemon | undefined;
  pokeList: Pokemon[] = [];
  game_index: number = 1;
  name: string = '';
  destroyRef = inject(DestroyRef);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private pokeDataService: PokeDataService,
    ) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.loadPokemon();
  }

  /**
   * Loads the Pokemon data based on the route parameters.
   * Retrieves the Pokemon list either from the data service or Firebase.
   */
  loadPokemon() {
    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      this.game_index = +params['game_index'];
      this.name       = params['name'];
      if (this.pokeDataService.$pokemonList) {
        this.pokeList = this.pokeDataService.$pokemonList;
        this.findPokemon();
      } else {
        this.firebaseService.getPokemon().pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: data => {
            this.pokeList = data;
            this.findPokemon();
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  /**
   * Finds a specific Pokemon from the list based on the game index.
   * If found, navigates to the detailed view of the Pokemon.
   * If not found, navigates back to the start.
   */
  findPokemon() {
    if (this.game_index && this.pokeList) {
      this.pokemon = this.pokeList.find(
        pokemon => pokemon.game_index === this.game_index
      );

      if (this.pokemon) {
        this.name = this.pokemon.name;
        this.router.navigate(['/pokedex/pokemon', this.game_index, this.name]);
      } else {
        this.navigateToStart();
      }
    } else {
      this.navigateToStart();
    }
  }

  navigateToStart() {
    this.router.navigate(['/pokedex']);
  }

  startScrolling(e: Event) {
    e.preventDefault();
    document.body.style.overflow = 'unset';
  }

  handleScrollToTop() {
    const element = document.querySelector('.detail-view-container');
    if (element) {
      (element as HTMLElement).scrollTo({ top: 0, behavior: 'instant' });
    }
  }
}
