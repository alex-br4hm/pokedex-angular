import {Component, Input, OnInit} from '@angular/core';
import {EvolutionChain, Pokemon} from '../../../core/models/pokemon';
import {PokeDataService} from '../../../core/services/poke-data.service';

@Component({
  selector: 'app-evolution-chain',
  imports: [],
  templateUrl: './evolution-chain.component.html',
  styleUrl: './evolution-chain.component.scss'
})
export class EvolutionChainComponent implements OnInit {
    @Input() evolution_chain: any;
    @Input() evolution_chain_url: string | undefined;

    pokeList: Pokemon[] = [];
    evolutions: any[] = [];

    constructor(private pokeDataService: PokeDataService) {
    }

    ngOnInit() {
        console.log(this.evolution_chain.name);

        console.log(this.evolution_chain.evolves_to[0].name);
        console.log(this.evolution_chain.evolves_to[0].trigger);
        console.log(this.evolution_chain.evolves_to[0].min_level);

        console.log(this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].name);
        console.log(this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].trigger);
        console.log(this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].min_level);

        this.pokeList = this.pokeDataService.$pokemonList;
        this.getEvolution();
    }

    getEvolution() {
        const first_evolution = {
          name: this.evolution_chain.evolves_to[0].name,
          trigger: this.evolution_chain.evolves_to[0].trigger,
          min_level: this.evolution_chain.evolves_to[0].min_level,
        }

        const second_evolution = {
          name: this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].name,
          trigger: this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].trigger,
          min_level: this.evolution_chain.evolves_to[0].evolves_to.evolves_to[0].min_level
        }

        this.evolutions.push(first_evolution, second_evolution);

      console.log(this.evolutions);
    }
}
