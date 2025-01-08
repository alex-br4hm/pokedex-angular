import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../core/components/footer/footer.component';
import {FirebaseService} from '../../core/services/firebase.service';
import {PokeDataService} from '../../core/services/poke-data.service';
import {Pokemon} from '../../core/models/pokemon';

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
  searchInput: string = '';
  isLoading: boolean = true;
  pokeList!: Pokemon[];
  initialPokeList: Pokemon[] = [];

  constructor(
    private fireBaseService: FirebaseService,
    private pokeDataService: PokeDataService) {
  }

  ngOnInit() {
    this.isLoading = true;

    // only for building database
    // this.pokeDataService.getDataForDB();

    this.fireBaseService.getPokemon().subscribe({
      next: data => {
        this.pokeList = data.sort((a, b) => a.game_index - b.game_index);
        this.initialPokeList = this.pokeList;
        this.pokeDataService.$pokemonList = this.initialPokeList;
        console.log(this.pokeList)
        this.isLoading = false;
      },
      error: error => {
        console.error("Fehler beim Abrufen der Daten:", error);
        this.isLoading = false;
      }
    })
  }

  updateSearchInput(newInput: string) {
    this.searchInput = newInput;
    console.log('Aktueller Suchinput:', this.searchInput);
    this.filterPokeList();

  }

  filterPokeList() {
    if (this.searchInput.length > 0) {
      console.log(this.pokeList);
      this.pokeList = this.initialPokeList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.pokeList = this.initialPokeList;
    }
  }
}
