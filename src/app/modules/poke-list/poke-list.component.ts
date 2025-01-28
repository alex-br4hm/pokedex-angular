import {Component, effect, OnInit, Output} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../core/components/footer/footer.component';
import {FirebaseService} from '../../core/services/firebase.service';
import {PokeDataService} from '../../core/services/poke-data.service';
import {Filter, Pokemon} from '../../core/models/pokemon';
import {SearchFilterBarComponent} from './search-filter-bar/search-filter-bar.component';
import {FilterDisplayComponent} from './filter-display/filter-display.component';

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
    FilterDisplayComponent,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  @Output() searchInput: string = '';

  isLoading: boolean = true;
  pokeList!: Pokemon[];
  initialPokeList: Pokemon[] = [];

  @Output() filterSelection!: Filter;
  initialFilterValues!: Filter;
  @Output() excludedTypes!: string[];

  constructor(
    private fireBaseService: FirebaseService,
    private pokeDataService: PokeDataService
    ) {

    effect(() => {
      this.filterSelection = this.pokeDataService.filterSelection();
      this.initialFilterValues = this.pokeDataService.initialFilterValues();
      this.searchInput = this.pokeDataService.searchInput();
      this.updateSearchInput();
      this.filterListAfterSelection();
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadData();
  }

  loadData() {
    const storedList: string | null = localStorage.getItem('pokemonList');
    if (storedList) {
      this.loadFromLocalStorage(storedList);
    } else {
      this.getDataFromDB();
    }
  }

  getDataFromDB() {
    this.fireBaseService.getPokemon().subscribe({
      next: data => {
        this.pokeList                     = data.sort((a, b) => a.game_index - b.game_index);
        this.initialPokeList              = this.pokeList;
        this.pokeDataService.$pokemonList = this.initialPokeList;
        this.saveInLocalStorage();
        this.changeLoadingState();
      },
      error: error => {
        console.error("Fehler beim Abrufen der Daten:", error);
        this.changeLoadingState();
      }
    });
  }

  saveInLocalStorage() {
    if (this.pokeList) {
      localStorage.setItem('pokemonList', JSON.stringify(this.pokeList));
    } else {
      console.warn("Pokémon-Liste ist leer oder nicht definiert.");
    }
  }

  loadFromLocalStorage(storedList: string) {
    this.pokeList                     = JSON.parse(storedList);
    this.initialPokeList              = this.pokeList;
    this.pokeDataService.$pokemonList = this.initialPokeList;
    this.changeLoadingState();
  }

  changeLoadingState() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  updateSearchInput() {
    if (this.searchInput.length > 0) {
      this.filterPokeList();
    } else {
      this.pokeList = this.initialPokeList;
    }
  }

  filterPokeList() {
    this.pokeList = this.initialPokeList;
    this.pokeList =
      this.pokeList.filter(pokemon =>
        pokemon.name
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    console.log(this.pokeList.length);
  }

  filterListAfterSelection() {
    if (!this.filterSelection) return;

    const types: string[]   = Object.keys(this.filterSelection.types);
    this.excludedTypes      = types.filter(type => !this.filterSelection.types[type]);
    const maxHeight: number = this.filterSelection.heightRange.endValue;
    const minHeight: number = this.filterSelection.heightRange.startValue;
    const maxWeight: number = this.filterSelection.weightRange.endValue;
    const minWeight: number = this.filterSelection.weightRange.startValue;
    const gen_1: boolean    = this.filterSelection.generation['gen_1'];
    const gen_2: boolean    = this.filterSelection.generation['gen_2'];

    this.pokeDataService.setExcludedTypes(this.excludedTypes);

    this.pokeList = this.pokeList.filter(pokemon => {
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
  }
}
