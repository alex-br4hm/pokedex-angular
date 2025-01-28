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

  constructor() {}

  ngOnInit() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    const labels: string[] = ['HP', 'Angriff', 'Verteidig.', 'Sp. Angr.', 'Sp. Verteid.', 'Geschwindigk.'];
    const data = this.stats.map(stat => stat.value);

    new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets: [{ label: 'Stats', data }] },
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
