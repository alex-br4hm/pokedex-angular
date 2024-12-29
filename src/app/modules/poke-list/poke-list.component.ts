import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {ApiService} from '../../core/services/api.service';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PokeDetailViewComponent} from '../poke-detail-view/poke-detail-view.component';
import {PokemonData} from '../../core/models/pokemon';
import {PokeDataService} from '../../core/services/poke-data.service';
import {FooterComponent} from '../../core/components/footer/footer.component';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
    CustomLoadingSpinnerComponent,
    RouterOutlet,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  pokeList!: PokemonData[];

  constructor(
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: data => {
        this.pokeList = data.results;
        // this.getPokeData();
        },
      error: error => {console.log(error);
    }});
  }

  // getPokeData() {
  //   this.pokeList.forEach((pokemon, index) => {
  //     this.apiService.getSinglePokemon(index + 1).subscribe({
  //         next: data => {
  //           this.pokeDataService.$pokemon.push(data);
  //         },
  //         error: error => {console.log(error);}
  //     })
  //   })
  // }

  stopScrolling(e: Event) {
      e.preventDefault();
      document.body.style.overflow = 'hidden';
  }
}
