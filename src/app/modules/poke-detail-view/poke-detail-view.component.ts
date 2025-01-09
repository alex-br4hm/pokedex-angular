import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {PokeDataService} from "../../core/services/poke-data.service";
import {PokeNumberPipePipe} from "../../shared/utils/poke-number-pipe.pipe";
import {Pokemon} from '../../core/models/pokemon';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {NgOptimizedImage} from '@angular/common';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import { Subscription} from 'rxjs';
import {StatsComponent} from './more-information-tabs/stats/stats.component';
import {FirebaseService} from '../../core/services/firebase.service';

@Component({
  selector: 'app-poke-detail-view',
  imports: [
    RouterLink,
    MatIcon,
    PokeNumberPipePipe,
    CustomLoadingSpinnerComponent,
    NgOptimizedImage,
    MatTabGroup,
    MatTab,
    StatsComponent
  ],
  templateUrl: './poke-detail-view.component.html',
  styleUrl: './poke-detail-view.component.scss'
})
export class PokeDetailViewComponent implements OnInit, OnDestroy {
  pokemon?: Pokemon | undefined;
  pokeList: Pokemon[] = [];
  game_index: number = 1;
  isLoading: boolean = true;

  private routeSub: Subscription | null = null;
  private firebaseSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private pokeDataService: PokeDataService,
    ) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.routeSub = this.route.params.subscribe(params => {
      this.game_index = +params['game_index'];

      if (this.pokeDataService.$pokemonList) {
        this.pokeList = this.pokeDataService.$pokemonList;
        this.findPokemon();
      } else {
        this.firebaseSub = this.firebaseService.getPokemon().subscribe({
          next: data => {
            this.pokeList = data;
            this.findPokemon();
          },
          error: err => {
            console.log(Error)
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.firebaseSub?.unsubscribe();
  }

  findPokemon(): void {
    if (this.game_index && this.pokeList) {
      this.pokemon = this.pokeList.find(entry => entry.game_index === this.game_index);
      console.log(this.pokemon);
      if (!this.pokemon) {
        console.log(this.pokemon);
        this.router.navigateByUrl(`/pokedex/pokemon/1`)
      }
    }

    if (this.game_index === 0) {
      this.router.navigateByUrl(`/pokedex/pokemon/1`)
    }
  }

  startScrolling(e: Event) {
    e.preventDefault();
    document.body.style.overflow = 'unset';
  }
}
