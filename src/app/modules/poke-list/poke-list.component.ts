import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../core/components/footer/footer.component';
import {FirebaseService} from '../../core/services/firebase.service';
import {PokeDataService} from '../../core/services/poke-data.service';
import {Pokemon} from '../../core/models/pokemon';
import {SearchFilterBarComponent} from './search-filter-bar/search-filter-bar.component';
import {MatDrawer, MatDrawerContainer, MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
    CustomLoadingSpinnerComponent,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    SearchFilterBarComponent,
    MatDrawerContainer,
    MatDrawer,
    MatButton,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent
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
    this.loadFromLocalStorage();

    // only for building database
    // this.pokeDataService.getDataForDB();
  }

  saveInLocalStorage() {
    if (this.pokeList) {
      localStorage.setItem('pokemonList', JSON.stringify(this.pokeList));
      console.log("Pokémon-Liste wurde im localStorage gespeichert.");
    } else {
      console.error("Pokémon-Liste ist leer oder nicht definiert.");
    }
  }

  loadFromLocalStorage() {
    const storedList = localStorage.getItem('pokemonList');
    if (storedList) {
      this.pokeList = JSON.parse(storedList);
      this.initialPokeList = this.pokeList;
      this.pokeDataService.$pokemonList = this.initialPokeList;
      console.log("Pokémon-Liste wurde aus dem localStorage geladen.");
      this.changeLoadingState();
    } else {
      this.getDataFromDB();
    }
  }

  getDataFromDB() {
    this.fireBaseService.getPokemon().subscribe({
      next: data => {
        this.pokeList = data.sort((a, b) => a.game_index - b.game_index);
        this.saveInLocalStorage();
        this.initialPokeList = this.pokeList;
        this.pokeDataService.$pokemonList = this.initialPokeList;
        console.log(this.pokeList);
        this.changeLoadingState();
      },
      error: error => {
        console.error("Fehler beim Abrufen der Daten:", error);
        this.changeLoadingState();
      }
    });
  }

  changeLoadingState() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  updateSearchInput(newInput: string) {
    this.searchInput = newInput;
    this.filterPokeList();
  }

  filterPokeList() {
    if (this.searchInput.length > 0) {
      this.pokeList = this.initialPokeList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
      this.changeLoadingState();
    } else {
      this.pokeList = this.initialPokeList;
    }
  }
}
