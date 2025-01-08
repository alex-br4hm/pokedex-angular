import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {forkJoin, map, Observable, tap} from 'rxjs';
import {Pokemon, PokemonData} from '../models/pokemon';
import {FirebaseService} from './firebase.service';


@Injectable({
  providedIn: 'root'
})
export class PokeDataService {
  $pokemon?: Pokemon;
  $pokemonList?: Pokemon[];

  initialPokeList: PokemonData[] = [];
  pokemon?: Pokemon;
  pokemonAPIList: Pokemon[] = [];

  constructor(
    private apiService: ApiService,
    private firestoreService: FirebaseService
    ) {
  }

  getDataForDB() {
    this.apiService.getData().subscribe({
      next: data => {
        this.initialPokeList = data.results;
        this.getPokemonData();
      }
    })
  }

  getPokemonData() {
    const requests = this.initialPokeList.map(poke =>
      this.apiService.getPokemonDetails(poke.url).pipe(
        map(data => ({
          game_index: data.id,
          height: data.height,
          small_img_url: data.sprites.front_default,
          stats: data.stats.map((stat: { base_stat: number; stat: { name: string; }; }) => ({
            value: stat.base_stat,
            name: stat.stat.name
          })),
          weight: data.weight,
          species_url: data.species.url,
          img_url: data.sprites.other.dream_world.front_default,
          types_en: data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
          name: '',
          name_en: data.name,
          info_texts: [],
          types_ger: [],
          genera: '',
          evolution_chain_url: '',
          evolution_chain: []
        }))
      )
    );

    // Lade alle Basisdaten parallel
    forkJoin(requests).subscribe(pokemonList => {
      this.pokemonAPIList = pokemonList;

      // Lade Details für jedes Pokémon
      this.getPokemonDetails();
    });
  }

  getPokemonDetails() {
    const requests = this.pokemonAPIList.map(poke =>
      this.apiService.getGermanInfo(poke.species_url).pipe(
        map(data => ({
          name: data.names.find((entry: any) => entry.language.name === 'de')?.name || 'Unbekannt',
          info_texts: data.flavor_text_entries
            .filter((entry: any) => entry.language.name === 'de')
            .map((entry: any) => entry.flavor_text),
          types_ger: this.getGermanTypesFromArray(poke.types_en),
          genera: data.genera.find((entry: any) => entry.language.name === 'de')?.genus || 'Unbekannt',
          evolution_chain_url: data.evolution_chain.url
        })),
        tap(details => {
          Object.assign(poke, details); // Aktualisiere das bestehende Pokémon-Objekt
        })
      )
    );

    // Lade alle Details parallel
    forkJoin(requests).subscribe(() => {
      console.log('Alle Pokémon-Details geladen:', this.pokemonAPIList);

      // Lade die Evolutionsketten
      this.getEvolutionChains();
    });
  }

  getEvolutionChains() {
    const requests = this.pokemonAPIList.map(poke =>
      this.apiService.getEvolutionInfo(poke.evolution_chain_url).pipe(
        map(data => this.buildEvolutionChain(data.chain)),
        tap(evolutionChain => {
          poke.evolution_chain = evolutionChain; // Füge die Evolutionskette hinzu
        })
      )
    );

    // Lade alle Evolutionsketten parallel
    forkJoin(requests).subscribe(() => {


      // this.savePokemonToFirestore();
    });
  }

  savePokemonToFirestore() {
    this.firestoreService.addBulkDataToCollection('pokemon', this.pokemonAPIList)
      .then(() => {
        console.log('Alle Pokémon wurden erfolgreich hochgeladen!');
      })
      .catch(error => {
        console.error('Fehler beim Hochladen der Pokémon:', error);
      });
  }

  buildEvolutionChain(chain: any): any {
    return {
      name: chain.species.name,
      evolves_to: chain.evolves_to.map((evolution: any) => ({
        name: evolution.species.name,
        trigger: evolution.evolution_details?.[0]?.trigger?.name || null,
        min_level: evolution.evolution_details?.[0]?.min_level || null,
        evolves_to: evolution.evolves_to.length > 0 ? this.buildEvolutionChain(evolution) : []
      }))
    };
  }

  getGermanTypesFromArray(typesArray: string[]): string[] {
    return typesArray.map(type => this.getGermanTypeName(type));
  }

  getGermanTypeName(type: string): string {
    const types = [
      { english: 'normal', german: 'Normal' },
      { english: 'fire', german: 'Feuer' },
      { english: 'water', german: 'Wasser' },
      { english: 'electric', german: 'Elektro' },
      { english: 'grass', german: 'Pflanze' },
      { english: 'flying', german: 'Flug' },
      { english: 'bug', german: 'Käfer' },
      { english: 'poison', german: 'Gift' },
      { english: 'rock', german: 'Gestein' },
      { english: 'ground', german: 'Boden' },
      { english: 'fighting', german: 'Kämpfer' },
      { english: 'ice', german: 'Eis' },
      { english: 'psychic', german: 'Psycho' },
      { english: 'ghost', german: 'Geist' },
      { english: 'dragon', german: 'Drache' },
      { english: 'fairy', german: 'Fee' },
      { english: 'dark', german: 'Unlicht' },
      { english: 'steel', german: 'Stahl' },
    ];

    return types.find(t => t.english === type)?.german || 'Unbekannter Typ';
  }

}
