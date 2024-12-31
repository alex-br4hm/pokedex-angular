import {Component, inject, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {ApiService} from '../../core/services/api.service';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PokeDetailViewComponent} from '../poke-detail-view/poke-detail-view.component';
import {PokemonCardData, PokemonData} from '../../core/models/pokemon';
import {PokeDataService} from '../../core/services/poke-data.service';
import {FooterComponent} from '../../core/components/footer/footer.component';
import {forkJoin} from 'rxjs';

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
  filteredPokeList!: PokemonData[];
  searchInput!: string;
  isLoaded: boolean = false;

  constructor(
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: data => {
        this.pokeList = data.results;
        this.getPokemonData();
        },
      error: error => {console.log(error);
    }});
  }

  getPokemonData() {
    const requests = this.pokeList.map((poke) =>
      this.apiService.getSinglePokemon2(poke.url)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((data, index) => {
          this.pokeList[index].id = data.id;
        });
        this.filteredPokeList = this.pokeList;
        this.isLoaded = true;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateSearchInput(newInput: string) {
    this.searchInput = newInput;
    this.filterPokeList();
    console.log(this.filteredPokeList);
    console.log('Aktueller Suchinput:', this.searchInput);
  }

  filterPokeList() {
    if (this.searchInput && this.searchInput.length > 0) {
      console.log('hello?')
      this.filteredPokeList = this.pokeList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.filteredPokeList = this.pokeList;
    }
  }


  stopScrolling(e: Event) {
      e.preventDefault();
      document.body.style.overflow = 'hidden';
  }
}
