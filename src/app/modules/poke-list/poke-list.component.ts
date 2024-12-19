import { Component } from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent {
  cards = Array(20).fill(0);
}
