import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {
  CustomLoadingSpinnerComponent
} from '../../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import {Chart, registerables} from 'chart.js';
import {Stats} from '../../../core/models/pokemon';
import {StatNamePipe} from '../../../shared/utils/stat-name.pipe';

@Component({
  selector: 'app-stats',
  imports: [
    CustomLoadingSpinnerComponent,
    NgxChartsModule,
    StatNamePipe,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, AfterViewInit {
  @Input() stats: Stats[] = [];

  ctx!: HTMLCanvasElement;
  labels!: string[];
  data!: (number | undefined)[];

  constructor() {}

  /**
   * Registering all required chart.js elements.
   */
  ngOnInit() {
    Chart.register(...registerables);
  }

  /**
   * Triggers the chart loading process after the view is fully initialized.
   */
  ngAfterViewInit() {
    this.loadChart();
  }

  /**
   * Loads and initializes the radar chart using Chart.js.
   * It sets the context, labels, and data for the chart, and configures the chart options.
   */
  loadChart() {
    this.ctx    = document.getElementById('radarChart') as HTMLCanvasElement;
    this.labels = ['HP', 'Angriff', 'Verteidig.', 'Sp. Angr.', 'Sp. Verteid.', 'Geschwindigk.'];
    this.data   = this.stats.map(stat => stat.value);

    new Chart(this.ctx, {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Stats',
          data: this.data
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            ticks: { display: false, stepSize: 30 },
            pointLabels: { color: 'white' },
            angleLines: { display: true, color: 'rgba(255, 255, 255, 0.75)' },
            grid: { color: 'rgba(255, 255, 255, 0.75)' },
            suggestedMin: 0,
            suggestedMax: 120,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }
}
