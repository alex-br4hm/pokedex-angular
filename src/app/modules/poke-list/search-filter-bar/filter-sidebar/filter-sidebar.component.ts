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
    NgClass
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
  })

  ngOnInit() {
    this.pokeList = this.pokeDataService.$pokemonList;
    this.getMinMaxValues();
    this.initialPatchValues();
    this.isLoading = false;

  }

  getMinMaxValues() {
    const weights = this.pokeList.map(p => p.weight);
    const heights = this.pokeList.map(p => p.height);
    this.minWeight = Math.min(...weights) / 10 ;
    this.maxWeight = Math.max(...weights) / 10;
    this.minHeight = Math.min(...heights) / 10;
    this.maxHeight = Math.max(...heights) / 10;
  }

  initialPatchValues() {
    this.filterSelections.patchValue({
      weightRange: {
        startValue: this.minWeight,
        endValue: this.maxWeight
      },
      heightRange: {
        startValue: this.minHeight,
        endValue: this.maxHeight
      }
    });
  }

  getFilterSelection() {
    const selection = this.filterSelections.value;
    this.filterToggledChange.emit(false);
    document.body.style.overflow = 'unset';
    this.pokeDataService.setFilterSelection(selection);
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
