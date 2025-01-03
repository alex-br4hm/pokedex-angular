import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PokemonData} from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon/';
  private readonly species_API_URL = 'https://pokeapi.co/api/v2/pokemon-species/'
  private readonly types_API_URL = 'https://pokeapi.co/api/v2/type/'

  constructor(private http: HttpClient) {
  }

  getData(): Observable<any> {
   return this.http.get(this.API_URL + '?limit=151');
  }

  getSinglePokemon(index: number): Observable<any> {
    return this.http.get(this.API_URL + index);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getGermanInfo(url: string): Observable<any> {
    return this.http.get(url);
  }

}
