import {Component, Input, OnInit} from '@angular/core';
import {Pokemon, Stats} from '../../../core/models/pokemon';
import {PokeHeightPipe} from '../../../shared/utils/poke-height.pipe';
import {PokeWeightPipe} from '../../../shared/utils/poke-weight.pipe';
import {PokeNumberPipePipe} from '../../../shared/utils/poke-number-pipe.pipe';
import {
  CustomLoadingSpinnerComponent
} from '../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';

@Component({
  selector: 'app-various-information',
  imports: [
    PokeHeightPipe,
    PokeWeightPipe,
    PokeNumberPipePipe,
    CustomLoadingSpinnerComponent
  ],
  templateUrl: './various-information.component.html',
  styleUrl: './various-information.component.scss'
})
export class VariousInformationComponent {
  @Input() pokemon: Pokemon | undefined;
}
