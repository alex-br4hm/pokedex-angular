import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {ApiServiceService} from '../../core/services/api-service.service';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  data:any;


  constructor(private apiService: ApiServiceService) {
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: data => {this.data = data.results;},
      error: error => {console.log(error);
    }});
  }
}
