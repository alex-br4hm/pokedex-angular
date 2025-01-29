import {Injectable, signal, WritableSignal} from '@angular/core';
import {Filter, Pokemon} from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeDataService {
  $pokemon?: Pokemon;
  $pokemonList!: Pokemon[];

  filterSelection: WritableSignal<Filter>     = signal<any>(null);
  initialFilterValues: WritableSignal<Filter> = signal<any>(null);
  excludedTypes: WritableSignal<string[]>     = signal<string[]>([]);
  searchInput: WritableSignal<string>         = signal<string>('');

  setFilterSelection(selection: Filter) {
    this.filterSelection.set(selection);
  }

  setInitialFilterValues(selection: Filter) {
    this.initialFilterValues.set(selection);
  }

  setExcludedTypes(selection: string[]) {
    this.excludedTypes.set(selection);
  }

  setSearchInput(searchInput: string) {
    this.searchInput.set(searchInput);
  }
}
