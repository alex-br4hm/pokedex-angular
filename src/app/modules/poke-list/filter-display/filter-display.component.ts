import {Component, effect} from '@angular/core';
import {PokeDataService} from '../../../core/services/poke-data.service';
import {Filter, FilterRange} from '../../../core/models/pokemon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-filter-display',
  imports: [
    MatTooltip
  ],
  templateUrl: './filter-display.component.html',
  styleUrl: './filter-display.component.scss'
})

/**
 * A class for display Pokémon filter.
 */
export class FilterDisplayComponent {
  initialFilterValues!: Filter;
  filterSelection!: Filter;
  excludedTypes!: string[];
  searchInput: string = '';

  gen_1: boolean | undefined = true;
  gen_2: boolean | undefined = true;

  heightFilter: FilterRange = {}
  weightFilter: FilterRange = {}

  heightFilterChange: boolean = false;
  weightFilterChange: boolean = false;

  anyFilterSet: boolean = false;

  constructor(private pokeDataService: PokeDataService) {
    effect(() => {
      this.initialFilterValues = this.pokeDataService.initialFilterValues();
      this.filterSelection     = this.pokeDataService.filterSelection();
      this.excludedTypes       = this.pokeDataService.excludedTypes();
      this.searchInput         = this.pokeDataService.searchInput();
      this.setInitialValues();
      this.setCurrentFilterValues();
      this.checkChanges();
    });
  }

  /** Sets the initial height and weight filter values. */
  setInitialValues() {
    if (!this.initialFilterValues) return;

    this.heightFilter.min = this.initialFilterValues.heightRange.startValue;
    this.heightFilter.max = this.initialFilterValues.heightRange.endValue;
    this.weightFilter.min = this.initialFilterValues.weightRange.startValue;
    this.weightFilter.max = this.initialFilterValues.weightRange.endValue;
  }

  /** Updates the current filter values based on user selection. */
  setCurrentFilterValues() {
    if (!this.filterSelection) return;

    this.heightFilter.currentStart = this.filterSelection.heightRange.startValue;
    this.heightFilter.currentEnd   = this.filterSelection.heightRange.endValue;
    this.weightFilter.currentStart = this.filterSelection.weightRange.startValue;
    this.weightFilter.currentEnd   = this.filterSelection.weightRange.endValue;
    this.gen_1                     = this.filterSelection.generation['gen_1'];
    this.gen_2                     = this.filterSelection.generation['gen_2'];

    this.checkChanges();
  }

  /** Checks if any filter values have changed.
   *  (heightRange, weightRange, types, generation, searchInput)
   *  Set 'anyFilterSet'-value to display filter correctly.
   * */
  checkChanges() {
    if (this.filterSelection) {
      this.heightFilterChange = this.heightFilter.max != this.heightFilter.currentEnd ||
                                this.heightFilter.min != this.heightFilter.currentStart;


      this.weightFilterChange = this.weightFilter.max != this.weightFilter.currentEnd ||
                                this.weightFilter.min != this.weightFilter.currentStart;

      this.anyFilterSet       = this.isFilterSelectionInitial() || this.searchInput.length > 0;
    }

    if (this.searchInput.length > 0) {
      this.anyFilterSet = true;
    }

    if (this.searchInput.length === 0 && !this.isFilterSelectionInitial()) {
      this.anyFilterSet = false;
    }
  }

  /**
   * Resets a specific filter category to its initial values.
   * Need to set new reference for signal.
   * @param {keyof Filter} category - The filter category to reset.
   * @param {string} key - The key of the specific filter within the category.
   */
  deleteFilter(category: keyof Filter, key: string) {
      this.filterSelection = {...this.filterSelection};

      if (category === 'heightRange') {
        this.filterSelection[category].startValue = this.heightFilter.min ?? 0;
        this.filterSelection[category].endValue   = this.heightFilter.max ?? 0;
      } else if (category === 'weightRange') {
        this.filterSelection[category].startValue = this.weightFilter.min ?? 0;
        this.filterSelection[category].endValue   = this.weightFilter.max ?? 0;
      } else {
        this.filterSelection[category][key] = true;
      }

      this.pokeDataService.setFilterSelection(this.filterSelection);
    }


  /** Clear searchInput clicking searchInput-Chip */
  clearSearchInput() {
    this.pokeDataService.setSearchInput('');
    this.anyFilterSet = false;
  }

  /**
   * returns true if filterSelection and initialFilterValues equal.
   * returns false if filterSelection and initialFilterValues not equal.
   */
  isFilterSelectionInitial() {
    return JSON.stringify(this.filterSelection) !== JSON.stringify(this.initialFilterValues);
  }
}
