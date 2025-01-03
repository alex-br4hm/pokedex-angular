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
  @Input() pokemon: PokemonCardData = {
    name: '',
    info_text: '',
    types_ger: [],
    types_en: [],
    img_url: '',
    game_index: this.index
  };

  constructor(private pokeDataService: PokeDataService) {
  }

  ngOnInit() {}

  sendDataToService() {
    this.pokeDataService.$pokemon = this.pokemon;
  }

}
