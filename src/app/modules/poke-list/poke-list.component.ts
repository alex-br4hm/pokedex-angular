import {Component, inject, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../core/components/header/header.component';
import {PokeCardComponent} from './poke-card/poke-card.component';
import {ApiService} from '../../core/services/api.service';
import {CustomLoadingSpinnerComponent} from '../../shared/ui/custom-loading-spinner/custom-loading-spinner.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PokeDetailViewComponent} from '../poke-detail-view/poke-detail-view.component';
import {PokeData, PokeInfo, PokemonCardData, PokemonData, Stats} from '../../core/models/pokemon';
import {PokeDataService} from '../../core/services/poke-data.service';
import {FooterComponent} from '../../core/components/footer/footer.component';
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-poke-list',
  imports: [
    HeaderComponent,
    PokeCardComponent,
    CustomLoadingSpinnerComponent,
    RouterOutlet,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss'
})
export class PokeListComponent implements OnInit {
  pokeList: PokeData[] = [];
  pokeInfoList: PokeData[] = [];
  filteredPokeList: PokemonCardData[] = [];
  initialPokeList: PokemonCardData[] = [];
  pokemon!: PokemonCardData;
  searchInput!: string;
  isLoading: boolean = true;
  searchLimit: number = 151;

  constructor(
    private apiService: ApiService,
    private pokeDataService: PokeDataService,
    ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.apiService.getData().subscribe({
      next: data => {
        this.pokeList = data.results;
        this.getPokemonData();
      },
      error: error => {
        console.error("Fehler beim Abrufen der Daten:", error);
        this.isLoading = false;
      }
    });
  }

  getPokemonData() {
    const requests = this.pokeList.map((poke: any) =>
      this.apiService.getPokemonDetails(poke.url).pipe(
        map(data => ({
          species_url: data.species.url,
          img_url: data.sprites.other.dream_world.front_default,
          types_en: data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
        }))
      )
    );

    forkJoin(requests).subscribe({
      next: pokemonData => {
        this.pokeInfoList = pokemonData;
        this.getGermanData();
      },
      error: error => {
        console.error("Fehler beim Abrufen der Pokémon-Daten:", error);
        this.isLoading = false;
      }
    });
  }

  getGermanData() {
    const requests = this.pokeInfoList.map(poke =>
      this.apiService.getGermanInfo(poke.species_url).pipe(
        map(data => ({
          name: data.names.find((entry: any) => entry.language.name === 'de')?.name || 'Unbekannt',
          info_text: data.flavor_text_entries.find((entry: any) => entry.language.name === 'de')?.flavor_text || 'Keine Beschreibung vorhanden.',
          types_ger: this.pokeDataService.getGermanTypesFromArray(poke.types_en),
          types_en: poke.types_en,
          img_url: poke.img_url,
          game_index: data.id,
        }))
      )
    );

    forkJoin(requests).subscribe({
      next: filteredData => {
        this.filteredPokeList = filteredData;
        this.initialPokeList = filteredData;
        this.isLoading = false;
      },
      error: error => {
        console.error("Fehler beim Abrufen der deutschen Daten:", error);
        this.isLoading = false;
      }
    });
  }

  updateSearchInput(newInput: string) {
    this.searchInput = newInput;
    this.filterPokeList();
    console.log('Aktueller Suchinput:', this.searchInput);
  }

  filterPokeList() {
    if (this.searchInput && this.searchInput.length > 0) {
      this.filteredPokeList = this.initialPokeList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.filteredPokeList = this.initialPokeList;
    }
  }

}
