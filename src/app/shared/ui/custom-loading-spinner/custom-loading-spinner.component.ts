import { Component } from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-custom-loading-spinner',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './custom-loading-spinner.component.html',
  styleUrl: './custom-loading-spinner.component.scss'
})
export class CustomLoadingSpinnerComponent {

}
