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
import {ApiServiceService} from '../../../core/services/api-service.service';

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
    MatCardSubtitle
  ],
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.scss'
})
export class PokeCardComponent implements OnInit {
  @Input() pokeData: any;
  @Input() index!: number;
  data:any;

  constructor(private apiService: ApiServiceService) {
  }

  ngOnInit() {
    this.apiService.getSinglePokemon(this.index+1).subscribe({
      next: data => {this.data = data},
      error: error => {console.log(error);
      }});
  }

}
