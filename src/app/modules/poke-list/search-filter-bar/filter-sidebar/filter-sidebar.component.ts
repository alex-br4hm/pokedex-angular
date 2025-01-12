import {Component, inject} from '@angular/core';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatChip} from '@angular/material/chips';
import {MatButton} from '@angular/material/button';

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
    MatButton
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
  // selectedTypes = new FormControl('');
  _formBuilder = inject(FormBuilder);

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
    weightRange: '',
    heightRange: ''
  })



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
