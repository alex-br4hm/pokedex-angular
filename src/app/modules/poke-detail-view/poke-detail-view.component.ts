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

@Component({
  selector: 'app-poke-detail-view',
  imports: [
    RouterLink,
    MatIcon,
    PokeNumberPipePipe,
    CustomLoadingSpinnerComponent,
    NgOptimizedImage,
    MatTabGroup,
    MatTab
  ],
  templateUrl: './poke-detail-view.component.html',
  styleUrl: './poke-detail-view.component.scss'
})
export class PokeDetailViewComponent implements OnInit {
  game_index!: number;
  pokemon: PokemonCardData = {
    name: '',
    infoText: '',
    types_ger: [],
    types_en: [],
    img_url: '',
    game_index:  this.game_index,
    stats: []
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {}

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.pokemon.game_index = params['game_index'];
    //   if (this.pokeDataService.$pokemon) {
    //     this.pokemon = this.pokeDataService.$pokemon;
    //   } else {
    //     this.getPokemonInformation();
    //     this.getGermanInfo();
    //   }
    // })
  }
  //
  // getPokemonInformation() {
  //   this.apiService.getSinglePokemon(this.pokemon.game_index).subscribe({
  //     next: data => {
  //       console.log(data.sprites);
  //
  //       this.getStats(data);
  //       this.pokemon.types_en = data.types.map((typeInfo: { type: { name: any; }; }) => typeInfo.type.name);
  //       this.pokemon.types_ger = this.getGermanTypesFromArray(this.pokemon.types_en);
  //       this.pokemon.img_url  = data.sprites.other.dream_world.front_default;
  //     }
  //   })
  // }
  //
  // getStats(data: any) {
  //   data.stats.forEach((element: any) => {
  //     this.pokemon.stats?.push(
  //       { base_stat: element.base_stat, name: element.stat.name }
  //     )
  //   });
  // }
  //
  // getGermanInfo() {
  //   this.apiService.getGermanInfo(this.pokemon.game_index).subscribe({
  //     next: data => {
  //       console.log(data);
  //       this.pokemon.name = data.names.find(
  //         (name: { language: { name: string; }; }) => name.language.name === 'de')?.name;
  //
  //       const germanFlavor = data.flavor_text_entries.find(
  //         (entry: { language: { name: string; }; }) => entry.language.name === 'de');
  //       this.pokemon.infoText = germanFlavor ? germanFlavor.flavor_text : 'Keine Beschreibung vorhanden.';
  //     },
  //     error: error => {console.log(error);}
  //   })
  // }
  //
  // testiTest() {
  //   console.log(this.pokemon);
  // }
  //
  // getGermanTypesFromArray(typesArray: string[]): string[] {
  //   return typesArray.map(typeObj => this.getGermanTypeName(typeObj));
  // }
  //
  // getGermanTypeName(type: string): string {
  //   const types = [
  //     { english: 'normal', german: 'Normal' },
  //     { english: 'fire', german: 'Feuer' },
  //     { english: 'water', german: 'Wasser' },
  //     { english: 'electric', german: 'Elektro' },
  //     { english: 'grass', german: 'Pflanze' },
  //     { english: 'flying', german: 'Flug' },
  //     { english: 'bug', german: 'Käfer' },
  //     { english: 'poison', german: 'Gift' },
  //     { english: 'rock', german: 'Gestein' },
  //     { english: 'ground', german: 'Boden' },
  //     { english: 'fighting', german: 'Kämpfer' },
  //     { english: 'ice', german: 'Eis' },
  //     { english: 'psychic', german: 'Psycho' },
  //     { english: 'ghost', german: 'Geist' },
  //     { english: 'dragon', german: 'Drache' },
  //     { english: 'fairy', german: 'Fee' },
  //     { english: 'dark', german: 'Unlicht' },
  //     { english: 'steel', german: 'Stahl' },
  //   ];
  //
  //   const typeObject = types.find((t) => t.english === type);
  //
  //   if (typeObject) {
  //     return typeObject.german;
  //   } else {
  //     return 'Unbekannter Typ';
  //   }
  // }

  startScrolling(e: Event) {
    e.preventDefault();
    document.body.style.overflow = 'unset';
  }
}
