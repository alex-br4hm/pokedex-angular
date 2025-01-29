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
  isLoading: boolean = true;

  isFormChanged: boolean        = false;
  isInitialFormChanged: boolean = false;
  resetDialogOpen: boolean      = false;
  sessionFilters?: any;

  @Input() filterToggled!: boolean;
  @Output() filterToggledChange = new EventEmitter<boolean>();

  _formBuilder = inject(FormBuilder);

  initialFilterValues!: Filter;

  constructor(private pokeDataService: PokeDataService) {
  }

  filterSelections = this._formBuilder.group({
    types: this._formBuilder.group({
      Normal: true,
      Feuer: true,
      Wasser: true,
      Elektro: true,
      Pflanze: true,
      Flug: true,
      Käfer: true,
      Gift: true,
      Gestein: true,
      Boden: true,
      Kämpfer: true,
      Eis: true,
      Psycho: true,
      Geist: true,
      Drache: true,
      Fee: true,
      Unlicht: true,
      Stahl: true,
    }),
    weightRange: this._formBuilder.group({
      startValue: 0,
      endValue: 0,
    }),
    heightRange: this._formBuilder.group({
      startValue: 0,
      endValue: 0,
    }),
    generation: this._formBuilder.group({
      gen_1: true,
      gen_2: true
    })
  })

  ngOnInit() {
    this.pokeList = this.pokeDataService.$pokemonList;
    this.getMinMaxValues();
    this.sessionFilters = this.pokeDataService.filterSelection();
    this.setInitialFilterSelection();

    if (this.sessionFilters) {
      this.filterSelections.patchValue(this.sessionFilters);
    } else {
      this.patchInitialFilterValues();
    }

    this.checkFormChanges();
    this.isLoading = false;

  }

  checkFormChanges() {
    if (this.sessionFilters) {
      this.isInitialFormChanged =
        JSON.stringify(this.sessionFilters) !== JSON.stringify(this.initialFilterValues);
    }

    this.filterSelections.valueChanges.subscribe(() => {
      this.isFormChanged =
        JSON.stringify(this.sessionFilters) !== JSON.stringify(this.filterSelections.value);
      this.isInitialFormChanged =
        JSON.stringify(this.filterSelections.value) !== JSON.stringify(this.initialFilterValues);
    });
  }

  getMinMaxValues() {
    const weights: number[] = this.pokeList.map(pokemon => pokemon.weight);
    const heights: number[] = this.pokeList.map(pokemon => pokemon.height);
    this.minWeight          = Math.min(...weights) / 10 ;
    this.maxWeight          = Math.max(...weights) / 10;
    this.minHeight          = Math.min(...heights) / 10;
    this.maxHeight          = Math.max(...heights) / 10;
  }

  setInitialFilterSelection() {
    this.initialFilterValues = {
      types: {
        Normal: true,
        Feuer: true,
        Wasser: true,
        Elektro: true,
        Pflanze: true,
        Flug: true,
        Käfer: true,
        Gift: true,
        Gestein: true,
        Boden: true,
        Kämpfer: true,
        Eis: true,
        Psycho: true,
        Geist: true,
        Drache: true,
        Fee: true,
        Unlicht: true,
        Stahl: true,
      },
      weightRange: {
        startValue: this.minWeight,
        endValue: this.maxWeight,
      },
      heightRange: {
        startValue: this.minHeight,
        endValue: this.maxHeight,
      },
      generation: {
        gen_1: true,
        gen_2: true,
      },
    }

    this.pokeDataService.setInitialFilterValues(this.initialFilterValues);
  }

  patchInitialFilterValues() {
    this.filterSelections.patchValue(this.initialFilterValues);
    this.sessionFilters = this.initialFilterValues;
  }

  useFilterSelection() {
    document.body.style.overflow = 'unset';
    this.filterToggledChange.emit(false);
    const filterSelections = JSON.stringify(this.filterSelections.value);
    this.pokeDataService.setFilterSelection(JSON.parse(filterSelections));
    window.scroll({top: 0, behavior: 'smooth'});
  }

  openResetDialog() {
    this.resetDialogOpen = true;
  }

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
