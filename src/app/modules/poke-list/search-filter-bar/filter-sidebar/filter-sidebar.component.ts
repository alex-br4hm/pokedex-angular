import {Component, inject, OnInit} from '@angular/core';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatChip} from '@angular/material/chips';
import {MatButton} from '@angular/material/button';
import {JsonPipe} from '@angular/common';
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
    PokeHeightPipe
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  // selectedTypes = new FormControl('');
  pokeList!: Pokemon[] | undefined;
  minHeight: number = 0;
  maxHeight: number = 0;
  minWeight: number = 0;
  maxWeight: number = 0;

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
      endValue: 200,
    }),
    heightRange: this._formBuilder.group({
      startValue: 0,
      endValue: 200,
    }),
  })

  ngOnInit() {
    this.pokeList = this.pokeDataService.$pokemonList;

    if (this.pokeList) {
      const weights = this.pokeList.map(p => p.weight);
      const heights = this.pokeList.map(p => p.height);

      this.minWeight = Math.min(...weights);
      this.maxWeight = Math.max(...weights);

      this.minHeight = Math.min(...heights);
      this.maxHeight = Math.max(...heights);
    }



  }

  getFilterSelection() {
    const selection = this.filterSelections.value;
    console.log(selection);
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
