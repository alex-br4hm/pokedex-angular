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

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getSinglePokemon(this.index+1).subscribe({
      next: data => {this.data = data},
      error: error => {console.log(error);
      }});
  }

}
