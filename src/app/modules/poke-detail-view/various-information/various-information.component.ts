import {Component, Input} from '@angular/core';
import {Pokemon} from '../../../core/models/pokemon';
import {PokeHeightPipe} from '../../../shared/utils/poke-height.pipe';
import {PokeWeightPipe} from '../../../shared/utils/poke-weight.pipe';
import {PokeNumberPipe} from '../../../shared/utils/poke-number.pipe';

@Component({
  selector: 'app-various-information',
  imports: [
    PokeHeightPipe,
    PokeWeightPipe,
    PokeNumberPipe
  ],
  templateUrl: './various-information.component.html',
  styleUrl: './various-information.component.scss'
})
export class VariousInformationComponent {
  @Input() pokemon: Pokemon | undefined;
}
