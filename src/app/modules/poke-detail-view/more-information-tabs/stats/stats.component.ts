import {Component, Input} from '@angular/core';
import {Stats} from '../../../../core/models/pokemon';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  @Input() stats!: Stats[];

  constructor() {

  }
}
