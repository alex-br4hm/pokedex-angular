import {Component, effect, OnInit} from '@angular/core';
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
import {PokeNumberPipePipe} from '../../shared/utils/poke-number-pipe.pipe';

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
    MatSidenavContent,
    PokeNumberPipePipe,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  searchInput: string = '';
  isLoading: boolean = true;
  pokeList!: Pokemon[];
  initialPokeList: Pokemon[] = [];
  gridView: boolean = true;

  filterSelection: any;


  constructor(
    private fireBaseService: FirebaseService,
    private pokeDataService: PokeDataService) {

    effect(() => {
      this.filterSelection = this.pokeDataService.filterSelection();
      this.filterListAfterSelection();
    });
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

  filterListAfterSelection() {
    console.log(this.filterSelection);
    this.isLoading = true;

    if (!this.filterSelection) {
      this.isLoading = false;
      return;
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 100)


    const selectedTypes = Object.keys(this.filterSelection.types)
      .filter(type => this.filterSelection.types[type]);

    const excludedTypes = Object.keys(this.filterSelection.types)
      .filter(type => !this.filterSelection.types[type]); // Deaktivierte Typen (false)

    console.log('Selected Types:', selectedTypes);
    console.log('Excluded Types:', excludedTypes);

    this.pokeList = this.initialPokeList.filter(pokemon =>
      pokemon.types_ger.every(type => !selectedTypes.includes(type))
    );


    this.pokeList = this.initialPokeList.filter(pokemon => {
      // Überprüfe, ob das Pokémon einen deaktivierten Typ hat
      const hasExcludedType = pokemon.types_ger.some(type => excludedTypes.includes(type));
      if (hasExcludedType) {
        return false; // Wenn das Pokémon einen deaktivierten Typ hat, wird es herausgefiltert
      }

      // Wenn das Pokémon keine deaktivierten Typen hat, überprüfe, ob es mit den ausgewählten Typen übereinstimmt
      return pokemon.types_ger.some(type => selectedTypes.includes(type));
    });

    console.log('Filtered Pokémon List:', this.pokeList);
  }
}
