import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {ApiService} from '../../core/services/api.service';
import {Pokemon, PokemonData} from '../../core/models/pokemon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
    MatProgressSpinner,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  pokeList!: any;


  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: data => {
        this.pokeList = data.results;
        },

      error: error => {console.log(error);
    }});
  }
}
