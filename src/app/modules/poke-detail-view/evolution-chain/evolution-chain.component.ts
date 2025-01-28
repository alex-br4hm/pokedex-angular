import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Evolution, Pokemon} from '../../../core/models/pokemon';
import {PokeDataService} from '../../../core/services/poke-data.service';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-evolution-chain',
  imports: [
    MatIcon,
    RouterLink,
  ],
  templateUrl: './evolution-chain.component.html',
  styleUrl: './evolution-chain.component.scss'
})
export class EvolutionChainComponent implements OnInit {
  @Input() evolution_chain: any;
  @Input() evolution_chain_url: string | undefined;
  @Output() scrollToTopEvent: EventEmitter<void> = new EventEmitter<void>();

  pokeList: Pokemon[] = [];
  evolutions: Evolution[] = [];

    constructor(private pokeDataService: PokeDataService) {
    }

  ngOnInit() {
    this.pokeList = this.pokeDataService.$pokemonList;
    this.getEvolution();
  }

  getEvolution() {
    const evolutions: any[] = [];

    const pokemon_1 : Pokemon | undefined = this.getPokemon(this.evolution_chain?.name);
    const evolution_1: any                = this.evolution_chain?.evolves_to?.[0];
    const pokemon_2: Pokemon | undefined  = this.getPokemon(evolution_1?.name);
    const evolution_2: any                = evolution_1?.evolves_to?.evolves_to?.[0];
    const pokemon_3: Pokemon | undefined  = this.getPokemon(evolution_2?.name);

    if (pokemon_1 && evolution_1) {
      evolutions.push(this.createEvolution(pokemon_1, pokemon_1.game_index));
    }

    if (pokemon_2 && evolution_1) {
      evolutions.push(this.createEvolution(pokemon_2, pokemon_2.game_index));
    }

    if (pokemon_3 && evolution_2) {
      evolutions.push(this.createEvolution(pokemon_3, pokemon_3.game_index));
    }

    this.evolutions = evolutions.filter(evo => evo !== null);
  }

  createEvolution(pokemon: Pokemon | undefined, game_index: number | undefined = undefined): any {
    if (!pokemon) return null;  // Kein Pokemon gefunden
    return {
      name: pokemon.name,
      img_url: pokemon.img_url,
      game_index: game_index || null,
    };
  }

  getPokemon(path: string | undefined): Pokemon | undefined {
    if (path) {
      return this.pokeList.find(pokemon => pokemon.name_en === path);
    }
    return undefined;
  }

  triggerScrollToTop(): void {
    this.scrollToTopEvent.emit();
  }

}
