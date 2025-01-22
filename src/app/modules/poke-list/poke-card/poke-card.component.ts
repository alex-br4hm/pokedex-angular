import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  CustomLoadingSpinnerComponent
} from '../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {NgOptimizedImage} from '@angular/common';
import {PokeNumberPipePipe} from '../../../shared/utils/poke-number-pipe.pipe';
import {Pokemon } from '../../../core/models/pokemon';
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
  @Input() pokemon!: Pokemon;
  imgLoaded: boolean = false;

  constructor(private pokeDataService: PokeDataService) {
  }

  ngOnInit() {
    this.imgLoaded = false;
  }

  onImageLoad() {
    this.imgLoaded = true;
  }

  sendDataToService() {
    this.pokeDataService.$pokemon = this.pokemon;
  }
}
