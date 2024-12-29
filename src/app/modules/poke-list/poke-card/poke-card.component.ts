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
import {PokemonGerData} from '../../../core/models/pokemon';

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
  @Input() pokeData: any;
  @Input() index!: number;
  data:any;
  pokemonGerData: PokemonGerData = {
    name: '',
    infoText: '',
    types: []
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getSinglePokemon(this.index + 1).subscribe({
      next: data => {
        this.data = data;
        this.pokemonGerData.types = this.getGermanTypesFromArray(this.data.types);
      },
      error: error => {console.log(error);
      }});

    this.apiService.getGermanInfo(this.index + 1).subscribe({
      next: data => {
        this.pokemonGerData.name = data.names.find(
          (name: { language: { name: string; }; }) => name.language.name === 'de')?.name;

        const germanFlavor = data.flavor_text_entries.find(
          (entry: { language: { name: string; }; }) => entry.language.name === 'de');
        this.pokemonGerData.infoText = germanFlavor ? germanFlavor.flavor_text : 'Keine Beschreibung vorhanden.';
      }
    })


  }

  getGermanTypesFromArray(typesArray: { slot: number, type: { name: string, url: string } }[]): string[] {
    return typesArray.map(typeObj => this.getGermanTypeName(typeObj.type.name));
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
      return 'Unbekannter Typ'; // Rückgabe, falls der Typ nicht gefunden wird
    }
  }


}
