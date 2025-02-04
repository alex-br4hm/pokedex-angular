import { Injectable } from '@angular/core';
import {Pokemon, PokemonData} from '../../models/pokemon';
import {ApiService} from './api.service';
import {forkJoin, map, tap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
/**
 * ########################################
 * THIS SERVICE IS ONLY FOR BUILDING THE
 * DATABASE. IT'S NEVER USED IN PRODUCTION.
 * #########################################
 * */
export class BuildDbService {

  constructor(
    private apiService: ApiService,
    private firestore: AngularFirestore) {
  }

  initialPokeList: PokemonData[] = [];
  pokemon?: Pokemon;
  pokemonAPIList: Pokemon[] = [];

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

    forkJoin(requests).subscribe(pokemonList => {
      // @ts-ignore
      this.pokemonAPIList = pokemonList;
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
          Object.assign(poke, details);
        })
      )
    );

    forkJoin(requests).subscribe(() => {
      console.log('Alle Pokémon-Details geladen:', this.pokemonAPIList);
      this.getEvolutionChains();
    });
  }

  getEvolutionChains() {
    const requests = this.pokemonAPIList.map(poke =>
      this.apiService.getEvolutionInfo(poke.evolution_chain_url).pipe(
        map(data => this.buildEvolutionChain(data.chain)),
        tap(evolutionChain => {
          poke.evolution_chain = evolutionChain;
        })
      )
    );

    forkJoin(requests).subscribe(() => {

    });
  }

  savePokemonToFirestore() {
    this.addBulkDataToCollection('pokemon', this.pokemonAPIList)
      .then(() => {
        console.log('Alle Pokémon wurden erfolgreich hochgeladen!');
      })
      .catch((error: any) => {
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

  addDataToCollection(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }

  addBulkDataToCollection(collectionName: string, dataArray: any[]) {
    const batch = this.firestore.firestore.batch();
    const collectionRef = this.firestore.collection(collectionName).ref;

    dataArray.forEach(data => {
      const docRef = collectionRef.doc();
      batch.set(docRef, data);
    });

    return batch.commit();
  }
}
