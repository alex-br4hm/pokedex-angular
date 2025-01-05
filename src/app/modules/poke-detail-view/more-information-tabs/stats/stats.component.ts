import {Component, Input, OnInit} from '@angular/core';

import {
  CustomLoadingSpinnerComponent
} from '../../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import {BaseChartDirective} from 'ng2-charts';



@Component({
  selector: 'app-stats',
  imports: [
    CustomLoadingSpinnerComponent,
    NgxChartsModule,
    BaseChartDirective,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  @Input() stats: { name: string; value: number }[] = [];


}
