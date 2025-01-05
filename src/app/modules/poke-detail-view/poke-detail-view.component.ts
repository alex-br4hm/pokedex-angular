import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ApiService} from '../../core/services/api.service';
import {PokeDataService} from "../../core/services/poke-data.service";
import {PokeNumberPipePipe} from "../../shared/utils/poke-number-pipe.pipe";
import {PokemonCardData} from '../../core/models/pokemon';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {NgOptimizedImage} from '@angular/common';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {forkJoin, map} from 'rxjs';
import {normalizeExtraEntryPoints} from '@angular-devkit/build-angular/src/tools/webpack/utils/helpers';
import {StatsComponent} from './more-information-tabs/stats/stats.component';

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
export class PokeDetailViewComponent implements OnInit {
  game_index!: number;
  pokemon: PokemonCardData = {
    game_index: 0,
    info_text: '',
    name: '',
    types_en: [],
    types_ger: []
  };
  pokemonDetail: any = {
    stats: [],
  };
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.route.params.subscribe(params => {
      this.pokemon.game_index = params['game_index'];
      if (this.pokeDataService.$pokemon) {
        this.pokemon = this.pokeDataService.$pokemon;
        this.getPokemonStats()
        this.getPokemonDetails();
        this.isLoading = false;
      } else {
        this.getSinglePokemon();
        this.getPokemonStats()
        this.getPokemonDetails();
      }

      console.log(this.pokemon);
    });
  }

  getSinglePokemon() {
   this.apiService.getSinglePokemon(this.pokemon.game_index).subscribe({
     next: data => {
       this.pokemon.types_en    = data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name);
       this.pokemon.img_url     = data.sprites.other.dream_world.front_default;
       this.pokemon.species_url = data.species.url;


       console.log(this.pokemonDetail);
       if (this.pokemon.species_url) {
         this.getGermanData(this.pokemon.species_url);
       }

     },
     error: error => {
       console.log(error);
       this.isLoading = false;
     }
   })
  }

  getGermanData(url: string) {
    this.apiService.getGermanInfo(url).subscribe({
      next: data => {
        this.pokemon.name      = data.names.find((entry: any) => entry.language.name === 'de')?.name || 'Unbekannt';
        this.pokemon.info_text = data.flavor_text_entries.find((entry: any) => entry.language.name === 'de')?.flavor_text || 'Keine Beschreibung vorhanden.';
        this.pokemon.types_ger = this.pokeDataService.getGermanTypesFromArray(this.pokemon.types_en);

        this.isLoading = false;
      }
    })
  }

  getPokemonDetails() {

  }

  getPokemonStats() {
    this.apiService.getSinglePokemon(this.pokemon.game_index).subscribe({
      next: data => {
        console.log(data);
        this.pokemonDetail.stats = data.stats.map((stat: { base_stat: number; stat: { name: string; }; }) => ({
          value: stat.base_stat,
          name: stat.stat.name
        }));
      },
      error: error => {
        console.log(error);
      }
    })
  }

  startScrolling(e: Event) {
    e.preventDefault();
    document.body.style.overflow = 'unset';
  }
}
