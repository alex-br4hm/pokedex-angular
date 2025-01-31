import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class EvolutionChainComponent implements OnInit, OnChanges {
  @Input() evolution_chain!: Evolution;
  @Output() scrollToTopEvent: EventEmitter<void> = new EventEmitter<void>();

  pokeList: Pokemon[]         = [];
  evolutionsList: Evolution[] = [];

  pokemon_1: Pokemon | undefined;
  pokemon_2: Pokemon | undefined;
  pokemon_3: Pokemon | undefined;
  evolution_1: any | undefined;
  evolution_2: Evolution | undefined;

  constructor(private pokeDataService: PokeDataService) {}

  ngOnInit() {
    this.pokeList = this.pokeDataService.$pokemonList;
    this.getEvolution()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['evolution_chain'] && changes['evolution_chain'].currentValue) {
      this.evolutionsList = [];
      this.resetEvolutions();
      this.getEvolution();
    }
  }

  resetEvolutions() {
    this.evolutionsList = [];
    this.pokemon_1      = undefined;
    this.pokemon_2      = undefined;
    this.pokemon_3      = undefined;
    this.evolution_1    = undefined;
    this.evolution_2    = undefined;
  }

  /**
   * Retrieves the evolution steps of a Pokémon and adds them to the `evolutionsList` for display.
   * This includes the first, second, and third evolutions (if available).
   *
   * @returns {void} The method updates the `evolutionsList` in place.
   */
  getEvolution(): void {
      this.pokemon_1   = this.getPokemon(this.evolution_chain?.name);
      this.evolution_1 = this.evolution_chain?.evolves_to?.[0];
      this.pokemon_2   = this.getPokemon(this.evolution_1?.name);

    if (this.evolution_1?.evolves_to?.evolves_to) {
      this.evolution_2 = this.evolution_1.evolves_to.evolves_to[0];
      this.pokemon_3   = this.getPokemon(this.evolution_2?.name);
    }

    if (this.pokemon_1 && this.evolution_1) {
      this.evolutionsList.push(this.createEvolution(this.pokemon_1));
    }

    if (this.pokemon_2 && this.evolution_1) {
      this.evolutionsList.push(this.createEvolution(this.pokemon_2));
    }

    if (this.pokemon_3 && this.evolution_2) {
      this.evolutionsList.push(this.createEvolution(this.pokemon_3));
    }
  }

  /**
   * Creates an evolution object from the given Pokémon.
   *
   * @param {Pokemon} pokemon - The Pokémon to create the evolution step for.
   * @returns {Evolution} The evolution object containing the Pokémon's name, image URL, and game index.
   */
  createEvolution(pokemon: Pokemon): Evolution {
    return {
      name:       pokemon.name,
      img_url:    pokemon.img_url,
      game_index: pokemon.game_index,
    };
  }

  /**
   * Retrieves a Pokémon from the list based on the provided name.
   *
   * @param {string | undefined} path - The name of the Pokémon to search for.
   * @returns {Pokemon | undefined} The Pokémon object if found, or `undefined` if no Pokémon matches the given name.
   */
  getPokemon(path: string | undefined): Pokemon | undefined {
    if (!path) return undefined;

    return this.pokeList.find(pokemon => pokemon.name_en === path);
  }

  triggerScrollToTop(): void {
    this.scrollToTopEvent.emit();
  }
}
