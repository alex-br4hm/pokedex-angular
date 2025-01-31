import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Filter, Pokemon} from '../../../../core/models/pokemon';
import {PokeDataService} from '../../../../core/services/poke-data.service';
import {
  CustomLoadingSpinnerComponent
} from '../../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';

@Component({
  selector: 'app-filter-sidebar',
  imports: [
    MatSlider,
    MatSliderRangeThumb,
    MatCheckbox,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    CustomLoadingSpinnerComponent
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  pokeList!: Pokemon[];
  minHeight: number  = 0;
  maxHeight: number  = 0;
  minWeight: number  = 0;
  maxWeight: number  = 0;
  heights: number[]  = [];
  weights: number[]  = [];
  isLoading: boolean = true;

  isFormChanged: boolean        = false;
  isInitialFormChanged: boolean = false;
  resetDialogOpen: boolean      = false;
  currentFilter?: Filter;
  initialFilterValues!: Filter;

  @Input() filterToggled!: boolean;
  @Output() filterToggledChange = new EventEmitter<boolean>();

  _formBuilder = inject(FormBuilder);

  constructor(private pokeDataService: PokeDataService) {}

  /**
   * A FormGroup representing the filter selections for Pokémon.
   * This includes selections for types, weight range, height range, and generation.
   * Each group contains individual controls with their respective default values.
   */
  filterSelections = this._formBuilder.group({
    types: this._formBuilder.group({
      Normal:  true,
      Feuer:   true,
      Wasser:  true,
      Elektro: true,
      Pflanze: true,
      Flug:    true,
      Käfer:   true,
      Gift:    true,
      Gestein: true,
      Boden:   true,
      Kämpfer: true,
      Eis:     true,
      Psycho:  true,
      Geist:   true,
      Drache:  true,
      Fee:     true,
      Unlicht: true,
      Stahl:   true,
    }),
    weightRange: this._formBuilder.group({
      startValue: 0,
      endValue:   0,
    }),
    heightRange: this._formBuilder.group({
      startValue: 0,
      endValue:   0,
    }),
    generation: this._formBuilder.group({
      gen_1: true,
      gen_2: true
    })
  })

  /**
   * Fetches the Pokémon list, current filter, and initializes values.
   * Sets the initial filter values if no current filter is available.
   */
  ngOnInit() {
    this.pokeList      = this.pokeDataService.$pokemonList;
    this.currentFilter = this.pokeDataService.filterSelection();
    this.getMinMaxValues();
    this.setInitialFilterSelection();

    if (this.currentFilter) {
      this.filterSelections.patchValue(this.currentFilter);
    } else {
      this.patchInitialFilterValues();
    }

    this.checkFormChanges();
    this.isLoading = false;
  }

  /**
   * Monitors changes in the form values and updates the change tracking flags.
   * Checks if the form values are initially changed compared to the original filter values.
   */
  checkFormChanges() {
    if (this.currentFilter) {
      this.isInitialFormChanged =
        JSON.stringify(this.currentFilter) !== JSON.stringify(this.initialFilterValues);
    }

    this.filterSelections.valueChanges.subscribe(() => {
      this.isFormChanged =
        JSON.stringify(this.pokeDataService.filterSelection()) !== JSON.stringify(this.filterSelections.value);
      this.isInitialFormChanged =
        JSON.stringify(this.filterSelections.value) !== JSON.stringify(this.initialFilterValues);
    });
  }

  /**
   * Calculates the minimum and maximum values for weight and height from the Pokémon list.
   * These values are used to initialize the weight and height range filters.
   */
  getMinMaxValues() {
    this.weights   = this.pokeList.map(pokemon => pokemon.weight);
    this.heights   = this.pokeList.map(pokemon => pokemon.height);
    this.minWeight = Math.min(...this.weights) / 10 ;
    this.maxWeight = Math.max(...this.weights) / 10;
    this.minHeight = Math.min(...this.heights) / 10;
    this.maxHeight = Math.max(...this.heights) / 10;
  }

  /**
   * Sets the initial filter values for types, weight range, height range, and generation.
   * These values are passed to the data service for use throughout the app.
   */
  setInitialFilterSelection() {
    this.initialFilterValues = {
      types: {
        Normal:  true,
        Feuer:   true,
        Wasser:  true,
        Elektro: true,
        Pflanze: true,
        Flug:    true,
        Käfer:   true,
        Gift:    true,
        Gestein: true,
        Boden:   true,
        Kämpfer: true,
        Eis:     true,
        Psycho:  true,
        Geist:   true,
        Drache:  true,
        Fee:     true,
        Unlicht: true,
        Stahl:   true,
      },
      weightRange: {
        startValue: this.minWeight,
        endValue:   this.maxWeight,
      },
      heightRange: {
        startValue: this.minHeight,
        endValue:   this.maxHeight,
      },
      generation: {
        gen_1: true,
        gen_2: true,
      },
    }

    this.pokeDataService.setInitialFilterValues(this.initialFilterValues);
  }

  /**
   * Patches the filter selections with the initial filter values.
   * This is used to reset the filter selections to their default state.
   */
  patchInitialFilterValues() {
    this.filterSelections.patchValue(this.initialFilterValues);
    this.currentFilter = this.initialFilterValues;
  }

  /**
   * Applies the current filter selection and updates the filter values in the data service.
   * It also scrolls the page to the top after applying the filter.
   */
  useFilterSelection() {
    document.body.style.overflow = 'unset';
    this.filterToggledChange.emit(false);
    const formattedFilterSelections = JSON.stringify(this.filterSelections.value);
    this.pokeDataService.setFilterSelection(JSON.parse(formattedFilterSelections));
    this.scrollToTop();
  }

  scrollToTop() {
    window.scroll({top: 0, behavior: 'smooth'});
  }

  openResetDialog() {
    this.resetDialogOpen = true;
  }

  /**
   * Resets the filter selections to their initial values and closes the reset dialog.
   */
  resetFilter() {
    this.resetDialogOpen = false;
    this.isInitialFormChanged = false;
    this.patchInitialFilterValues();
  }

  typeList: string[] = [
    'Normal', 'Feuer', 'Wasser', 'Elektro', 'Pflanze',
    'Flug', 'Käfer', 'Gift', 'Gestein', 'Boden',
    'Kämpfer', 'Eis', 'Psycho', 'Geist', 'Drache',
    'Fee', 'Unlicht', 'Stahl'
  ];
}
