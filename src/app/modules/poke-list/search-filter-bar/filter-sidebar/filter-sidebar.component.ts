import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatChip} from '@angular/material/chips';
import {MatButton} from '@angular/material/button';
import {JsonPipe, NgClass} from '@angular/common';
import {PokeWeightPipe} from '../../../../shared/utils/poke-weight.pipe';
import {PokeHeightPipe} from '../../../../shared/utils/poke-height.pipe';
import {Pokemon} from '../../../../core/models/pokemon';
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
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatChip,
    MatButton,
    JsonPipe,
    PokeWeightPipe,
    PokeHeightPipe,
    FormsModule,
    NgClass,
    CustomLoadingSpinnerComponent
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  pokeList!: Pokemon[];
  minHeight: number = 0;
  maxHeight: number = 0;
  minWeight: number = 0;
  maxWeight: number = 0;
  isLoading: boolean = true;

  sessionFilters?: string | null;
  resetDialogOpen: boolean = false;
  @Input() filterToggled!: boolean;
  @Output() filterToggledChange = new EventEmitter<boolean>();

  _formBuilder = inject(FormBuilder);

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
    this.sessionFilters = sessionStorage.getItem('filterSelections');
    if (this.sessionFilters) {
      this.filterSelections.patchValue(JSON.parse(this.sessionFilters));
    } else {
      this.setInitialFilterSelection();
    }

    this.isLoading = false;

  }

  getMinMaxValues() {
    const weights: number[] = this.pokeList.map(p => p.weight);
    const heights: number[] = this.pokeList.map(p => p.height);
    this.minWeight          = Math.min(...weights) / 10 ;
    this.maxWeight          = Math.max(...weights) / 10;
    this.minHeight          = Math.min(...heights) / 10;
    this.maxHeight          = Math.max(...heights) / 10;
  }

  setInitialFilterSelection() {
    this.filterSelections.patchValue({
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
        endValue: this.maxWeight
      },
      heightRange: {
        startValue: this.minHeight,
        endValue: this.maxHeight
      },
      generation: {
        gen_1: true,
        gen_2: true,
      },
    });
  }

  getFilterSelection() {
    document.body.style.overflow = 'unset';
    this.filterToggledChange.emit(false);
    sessionStorage.setItem('filterSelections', JSON.stringify(this.filterSelections.value));
    this.pokeDataService.setFilterSelection(this.filterSelections.value);
  }

  openResetDialog() {
    this.resetDialogOpen = true;
  }

  resetFilter() {
    this.resetDialogOpen = false;
    this.setInitialFilterSelection();

  }

  typeList = [
    'Normal',
    'Feuer',
    'Wasser',
    'Elektro',
    'Pflanze',
    'Flug',
    'Käfer',
    'Gift',
    'Gestein',
    'Boden',
    'Kämpfer',
    'Eis',
    'Psycho',
    'Geist',
    'Drache',
    'Fee',
    'Unlicht',
    'Stahl'
  ];

}
