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
import {object} from '@angular/fire/database';
import {PokeHeightPipe} from '../../shared/utils/poke-height.pipe';

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
    PokeHeightPipe,
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

  sessionFilter?: string | null;
  filterSelection: any;
  excludedTypes!: string[];


  constructor(
    private fireBaseService: FirebaseService,
    private pokeDataService: PokeDataService) {

    effect(() => {
      this.filterSelection = this.pokeDataService.filterSelection();
      if (this.filterSelection) {
        console.log(this.filterSelection.weightRange.endValue)
        this.filterListAfterSelection();
      }
    });
  }


  ngOnInit() {
    this.isLoading = true;
    this.loadFromLocalStorage();
    this.checkFilterSelection();

    // only for building database
    // this.pokeDataService.getDataForDB();
  }

  checkFilterSelection() {
    this.sessionFilter = sessionStorage.getItem('filterSelections');
    if (this.sessionFilter) {
      this.filterSelection = (JSON.parse(this.sessionFilter));
      this.filterListAfterSelection();
    }
  }

  saveInLocalStorage() {
    if (this.pokeList) {
      localStorage.setItem('pokemonList', JSON.stringify(this.pokeList));
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
    this.isLoading = true;
    const types: string[]         = Object.keys(this.filterSelection.types);
    this.excludedTypes            = types.filter(type => !this.filterSelection.types[type]);
    const maxHeight: number       = this.filterSelection.heightRange.endValue;
    const minHeight: number       = this.filterSelection.heightRange.startValue;
    const maxWeight: number       = this.filterSelection.weightRange.endValue;
    const minWeight: number       = this.filterSelection.weightRange.startValue;
    const gen_1: boolean          = this.filterSelection.generation.gen_1;
    const gen_2: boolean          = this.filterSelection.generation.gen_2;

    this.pokeList = this.initialPokeList.filter(pokemon => {
      const pokeHeight: number = pokemon.height / 10;
      const pokeWeight: number = pokemon.weight / 10;

      const hasExcludedType = pokemon.types_ger.some(type => this.excludedTypes.includes(type));
      if (hasExcludedType) {
        return false;
      }

      if (!gen_1 && pokemon.game_index <= 151) {
        return false;
      }

      if (!gen_2 && pokemon.game_index > 151) {
        return false;
      }

      if (pokeWeight < minWeight || pokeWeight > maxWeight) {
        return false;
      }

      if (pokeHeight < minHeight || pokeHeight > maxHeight) {
        return false;
      }

      return true;
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 50)
  }
}
