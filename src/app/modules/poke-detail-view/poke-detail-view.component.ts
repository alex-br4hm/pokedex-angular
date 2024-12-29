import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-poke-detail-view',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './poke-detail-view.component.html',
  styleUrl: './poke-detail-view.component.scss'
})
export class PokeDetailViewComponent implements OnInit {
  game_index!: number;
  pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.game_index = params['game_index'];
      this.getPokemonInformation();
    })
  }

  getPokemonInformation() {
    this.apiService.getSinglePokemon(this.game_index).subscribe({
      next: data => {
        this.pokemon = data;
        console.log(this.pokemon);
      }
    })
  }

  startScrolling(e: Event) {
    e.preventDefault();
    document.body.style.overflow = 'unset';
  }
}
