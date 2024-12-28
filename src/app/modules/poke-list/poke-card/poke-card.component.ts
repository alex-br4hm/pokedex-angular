import {Component, Input, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../../core/services/api.service';
import {
  CustomLoadingSpinnerComponent
} from '../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {NgOptimizedImage} from '@angular/common';
import {PokeNumberPipePipe} from '../../../shared/utils/poke-number-pipe.pipe';

@Component({
  selector: 'app-poke-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardImage,
    MatCardTitle,
    MatCardSubtitle,
    CustomLoadingSpinnerComponent,
    NgOptimizedImage,
    PokeNumberPipePipe
  ],
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.scss'
})
export class PokeCardComponent implements OnInit {
  @Input() pokeData: any;
  @Input() index!: number;
  data:any;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getSinglePokemon(this.index+1).subscribe({
      next: data => {
        this.data = data;
          console.log(this.data);
      },
      error: error => {console.log(error);
      }});


  }

}
