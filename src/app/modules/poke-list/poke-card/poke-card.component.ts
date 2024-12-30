import {Component, Input, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {ApiService} from '../../../core/services/api.service';
import {
  CustomLoadingSpinnerComponent
} from '../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {NgOptimizedImage} from '@angular/common';
import {PokeNumberPipePipe} from '../../../shared/utils/poke-number-pipe.pipe';
import {PokemonCardData} from '../../../core/models/pokemon';
import {PokeDataService} from '../../../core/services/poke-data.service';

@Component({
  selector: 'app-poke-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
    MatCardSubtitle,
    NgOptimizedImage,
    PokeNumberPipePipe,
    CustomLoadingSpinnerComponent
  ],
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.scss'
})
export class PokeCardComponent implements OnInit {
  @Input() index!: number;
  pokemon: PokemonCardData = {
    name: '',
    infoText: '',
    typesGer: [],
    typesEn: [],
    img_url: '',
    game_index: this.index
  };

  constructor(
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {
  }

  ngOnInit() {
    this.pokemon.game_index = this.index + 1;
    this.getPokeData();
    this.getGermanInfo();
  }

  getPokeData() {
    this.apiService.getSinglePokemon(this.pokemon.game_index).subscribe({
      next: data => {
        this.pokemon.typesEn  = data.types.map((typeInfo: { type: { name: any; }; }) => typeInfo.type.name);
        this.pokemon.typesGer = this.getGermanTypesFromArray(this.pokemon.typesEn);
        this.pokemon.img_url  = data.sprites.other.dream_world.front_default;
      },
      error: error => {console.log(error);
      }});
  }

  getGermanInfo() {
    this.apiService.getGermanInfo(this.pokemon.game_index).subscribe({
      next: data => {
        this.pokemon.name = data.names.find(
          (name: { language: { name: string; }; }) => name.language.name === 'de')?.name;

        const germanFlavor = data.flavor_text_entries.find(
          (entry: { language: { name: string; }; }) => entry.language.name === 'de');
        this.pokemon.infoText = germanFlavor ? germanFlavor.flavor_text : 'Keine Beschreibung vorhanden.';

        this.sendDataToService();
      },
      error: error => {console.log(error);}
    })
  }

  sendDataToService() {
    this.pokeDataService.$pokemon = this.pokemon;
  }

  getGermanTypesFromArray(typesArray: string[]): string[] {
    return typesArray.map(typeObj => this.getGermanTypeName(typeObj));
  }

  getGermanTypeName(type: string): string {
    const types = [
      { english: 'normal', german: 'Normal' },
      { english: 'fire', german: 'Feuer' },
      { english: 'water', german: 'Wasser' },
      { english: 'electric', german: 'Elektro' },
      { english: 'grass', german: 'Pflanze' },
      { english: 'flying', german: 'Flug' },
      { english: 'bug', german: 'Käfer' },
      { english: 'poison', german: 'Gift' },
      { english: 'rock', german: 'Gestein' },
      { english: 'ground', german: 'Boden' },
      { english: 'fighting', german: 'Kämpfer' },
      { english: 'ice', german: 'Eis' },
      { english: 'psychic', german: 'Psycho' },
      { english: 'ghost', german: 'Geist' },
      { english: 'dragon', german: 'Drache' },
      { english: 'fairy', german: 'Fee' },
      { english: 'dark', german: 'Unlicht' },
      { english: 'steel', german: 'Stahl' },
    ];

    const typeObject = types.find((t) => t.english === type);

    if (typeObject) {
      return typeObject.german;
    } else {
      return 'Unbekannter Typ';
    }
  }


}
